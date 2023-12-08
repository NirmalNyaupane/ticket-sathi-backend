import Mailgen, { ContentBody, ColumnOptions, Content, Option } from "mailgen";
import dotenv from "dotenv";
import { error } from "../theme/chalk.theme.js";
import nodemailer, { SendMailOptions, TransportOptions } from "nodemailer";

dotenv.config();

interface payload {
  email: string;
  subject: string;
  mailGenContent: Content;
}

const sendMail = async (option: payload) => {
    console.log(option);
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "NeCommerce",
      link: "https://NeCommerce.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(option.mailGenContent);

  const emailHtmp = mailGenerator.generate(option.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "492f9eac5aa2c4",
      pass: "f37afd4a2777a2"
    }
});

  const mail: SendMailOptions = {
    from: `neommerce <neommerce@example.com>`,
    to: option.email,
    subject: option.subject,
    text: emailTextual,
    html: emailHtmp,
  };

  try {
    const res = await transporter.sendMail(mail);
    console.log("email send sucessfully", res);
  } catch (e) {
    console.log(error("Email service failed"), e);
  }
};

const registerEmailVerificationMailGenContent = (
  fullname: string,
  otp: number
): Content => {
  return {
    body: {
      name: fullname,
      intro: "Thankyou for using NeCommerce",

      action: {
        instructions: "Your otp",
        button: {
          color: "#22BC66", // Optional action button color
          text: otp?.toString(),
          link: "",
        },
      },
      outro:
        "If you have any questions or need further assistance, please feel free to contact our customer service.",
    },
  };
};


const emailVerificationMailGenContent = (
  otp: number
): Content => {
  return {
    body: {
      intro: "Thankyou for using NeCommerce",
      action: {
        instructions: "Your otp",
        button: {
          color: "#22BC66", // Optional action button color
          text: otp?.toString(),
          link: "",
        },
      },
      outro:
        "If you have any questions or need further assistance, please feel free to contact our customer service.",
    },
  };
};
export { sendMail, registerEmailVerificationMailGenContent, emailVerificationMailGenContent};
