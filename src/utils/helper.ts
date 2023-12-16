import { OTP_EXPIRE } from "../constant/index.js";

const generateOtpExpireTime = (): Date => {
  return new Date(Date.now() + OTP_EXPIRE);
};

const ifElseObj = <T>(condition: boolean, ifTrue: T): T | {} =>
  condition ? ifTrue : {};

export { generateOtpExpireTime, ifElseObj };
