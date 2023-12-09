import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import OtpModel from "../../models/otp.model.js";
import UserModel from "../../models/user.model.js";
import { error } from "../../theme/chalk.theme.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { generateOtpExpireTime } from "../../utils/helper.js";
import {
  emailVerificationMailGenContent,
  registerEmailVerificationMailGenContent,
  sendMail,
} from "../../utils/mail.js";
const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /************ checking if email is already registered or not **************/
    const userResult = await UserModel.findOne({
      where: {
        email: req.body.email,
      },
    });

    //Email is already exits then return email is already exits response
    if (userResult) {
      return next(new ApiError(409, "email already exits"));
    }

    //we sure that, the user with this email is not exit
    const userData = await UserModel.create(req.body);
    const { password, ...remainingData } = userData?.dataValues;

    //generate otp
    const otp = OtpModel.generateOtp();

    //save otp on db
    if (userData) {
      await OtpModel.create({
        email: req.body.email,
        otp: otp?.toString(),
        expiredAt: generateOtpExpireTime(),
      });
    }

    //send otp mail
    await sendMail({
      email: req.body.email,
      subject: "Email verification",
      mailGenContent: registerEmailVerificationMailGenContent(
        req.body.full_name,
        otp
      ),
    });
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          remainingData,
          "User is registered, please check your mail for verification"
        )
      );
  } catch (err) {
    console.log(error(err));
    return next(new ApiError(500, "Internal server error"));
  }
};

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    //get a user by email
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    //if user is not found
    if (!user) {
      return next(new ApiError(400, "User does not exits"));
    }

    //if password is not matched
    if (!(await user.verifyPassword(password))) {
      return next(new ApiError(400, "Invalid credentials"));
    }

    if (!user.is_verified) {
      const otp = OtpModel.generateOtp();
      sendMail({
        email: email,
        subject: "Verify your account",
        mailGenContent: emailVerificationMailGenContent(otp),
      });

      await OtpModel.destroy({
        where: {
          email: email,
        },
      });

      await OtpModel.create({
        otp: otp?.toString(),
        email: email,
        expiredAt: generateOtpExpireTime(),
      });
      res.status(400).json({
        is_verified: false,
        message: "Your email is not verified. Please check your email for otp",
      });
    }

    const accessToken = user.generateAccessToken();
    res.status(200).json({
      id: user.id,
      access_token: accessToken,
      role: user.role,
      is_verified: user.is_verified,
      is_organizer_registered:user.is_organizer_registered
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

const emailVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp: bodyOtp } = req.body;
  try {
    //check email is register or not
    const otp = await OtpModel.findOne({
      where: {
        email: email,
      },
    });

    //If email is not in table that means email is not registered and throw email is not registered message
    if (!otp) {
      return next(
        new ApiError(410, "Email is not registered", ["Bad request"])
      );
    }

    //checking if user is verify or not
    const isUserVerified = await UserModel.findOne({
      attributes: ["is_verified"],
      where: { email: email },
    });

    if (isUserVerified?.is_verified) {
      return next(new ApiError(400, "User is already verified"));
    }

    //if otp is not matched, send invalid otp
    if (!(await otp?.verifyOtp(bodyOtp))) {
      return next(new ApiError(409, "Invalid otp", ["Bad request"]));
    }

    //check if otp is expired or not
    if (new Date() > new Date(otp?.expiredAt || "")) {
      return next(new ApiError(410, "Otp is expired"));
    }

    //update the is_verified
    const updateResult = await UserModel.update(
      { is_verified: true },
      {
        where: {
          email: email,
        },
      }
    );
    if (updateResult[0]) {
      return res.status(200).json({ message: "email is verified" });
    } else {
      return next(
        new ApiError(500, "email is not verified", ["problem occurs"])
      );
    }
  } catch (err) {
    console.log(error(err));
    return next(new ApiError(500, "Internal server error"));
  }
};

const initiatePasswordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const otp = OtpModel.generateOtp();

    //checking email is on the table or not
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return next(new ApiError(400, "email doesnot exits"));
    }

    //delete existing otp
    await OtpModel.destroy({
      where: {
        email: email,
      },
    });

    //send the new otp
    await sendMail({
      email: email,
      subject: "forgot password",
      mailGenContent: emailVerificationMailGenContent(otp),
    });

    await OtpModel.create({
      email: email,
      otp: otp.toString(),
      expiredAt: generateOtpExpireTime(),
    });

    res.status(200).json({
      message: "Otp is send to your mail, please check your mail",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

const finalizePasswordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp, new_password } = req.body;
  try {
    //checking if email is

    const otpResult = await OtpModel.findOne({
      where: {
        email: email,
      },
    });

    if (!otpResult) {
      return next(new ApiError(400, "email is not found"));
    }

    //if otp is not matched, send invalid otp
    if (!(await otpResult?.verifyOtp(otp))) {
      return next(new ApiError(409, "Invalid otp"));
    }
    //check expiry time
    if (new Date() > new Date(otpResult?.expiredAt || "")) {
      return next(new ApiError(410, "Otp is expired"));
    }

    const hasedPassword = await bcrypt.hash(new_password, 10);
    const updateResponse = await UserModel.update(
      { password: hasedPassword },
      {
        where: {
          email: email,
        },
      }
    );

    if (updateResponse[0]) {
      return res.status(200).json({
        message: "Password change sucessfully",
      });
    } else {
      return next(new ApiError(500, "Cannot update password"));
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal server error"));
  }
};

const resendEmailVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    //checking email is registered or not
    const user = await UserModel.findOne({ where: { email: email } });

    if (!user) {
      return next(new ApiError(400, "email does not exits"));
    }

    //checking email is already verified not
    if (user.is_verified) {
      return next(new ApiError(400, "user is already verified"));
    }

    const otp = await OtpModel.findOne({ where: { email: email } });
    if (new Date() < new Date(otp?.expiredAt || "")) {
      return next(new ApiError(400, "Please reset your otp after one minute"));
    }

    const newOtp = OtpModel.generateOtp();
    await OtpModel.destroy({ where: { email: email } });
    await OtpModel.create({
      email: email,
      otp: newOtp.toString(),
      expiredAt: generateOtpExpireTime(),
    });
    await sendMail({
      email: email,
      subject: "Password reset",
      mailGenContent: emailVerificationMailGenContent(newOtp),
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Email verification OTP has been resent. Please check your mail"
        )
      );
  } catch (error) {
    console.log(error);

    return next(new ApiError(500, "Internal server error"));
  }
};

export {
  emailVerificationController,
  finalizePasswordResetController,
  initiatePasswordResetController,
  loginController,
  registerUserController,
  resendEmailVerificationController,
};
