import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOULDINARY_NAME,
  api_key: process.env.CLOULDINARY_API_KEY,
  api_secret: process.env.CLOULDINARY_API_SECRET,
});

/* this function takes the url of local image which is stored locally on our server through multer */
const uploadOnClouldinary = async (
  localUrl: string,
): Promise<UploadApiResponse | null> => {
  try {
    if (!localUrl) return null;
    const response = await cloudinary.uploader.upload(
      localUrl,
      {
        resource_type: "auto",
      }
    );

    //file is sucessfully upload
    fs.unlinkSync(localUrl);

    return response;
  } catch (err) {
    fs.unlinkSync(localUrl);
    return null;
  }
};

export default uploadOnClouldinary;
