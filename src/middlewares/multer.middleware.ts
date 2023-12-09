import multer from "multer";
import ApiError from "../utils/ApiError.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //storing file by .png, .jpg, .jpeg instead of binary
    let fileExtension = "";

    if (file?.originalname?.split(".").length > 1) {
      fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf(".")
      );
    }

    const fileNameWithOutExtension = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(fileExtension, "");

    cb(
      null,
      fileNameWithOutExtension +
        Date.now() +
        Math.random() * //to avoid rare name conflit
          1e5 +
        fileExtension
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileMimeType = file.mimetype;
    if (fileMimeType.split("/")![0] === "image") {
      return cb(null, true);
    }
    cb(new ApiError(400, "only image is allowed"));
  },
  limits: {
    fieldSize: 1000,
  },
});

export default upload;
