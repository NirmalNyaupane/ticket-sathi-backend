import { OTP_EXPIRE } from "../constant/index.js"

const generateOtpExpireTime = ():Date=>{
    return new Date(Date.now() + OTP_EXPIRE)
}

export {generateOtpExpireTime};