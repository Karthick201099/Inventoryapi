//const otpGenerator = require("otp-generator");

// Function to generate OTP
const generateOTP = () => {
  // Generate a 6-digit numeric OTP
  // const otp = otpGenerator.generate(6, {
  //   upperCase: false,
  //   specialChars: false,
  //   alphabets: false,
  //   number: true,
  // });
  const otps = Math.floor(100000 + Math.random() * 900000);
  return otps.toString();
};

module.exports = generateOTP;
