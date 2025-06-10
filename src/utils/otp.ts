export const generateOTP = ()=>{
    return Math.floor(100000 + Math.random()*900000).toString();
}

export const isOTPExpired = (otpExpiresAt: Date)=>{
    const currentTime = new Date(Date.now()).toISOString();
    return currentTime > otpExpiresAt.toISOString()
}