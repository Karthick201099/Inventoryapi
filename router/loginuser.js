const express = require("express");
const nodemailer = require("nodemailer");
const generateOTP = require("../router/otp");
router = express.Router();

const { UserModel } = require("../model/user");
const Joi = require("joi");
const smtpConfig = {
  host: "smtp.hostinger.com", // Replace with your actual SMTP server hostname
  port: 465, // Common port for secure SMTP (SSL/TLS)
  secure: true, // Use secure connection
  auth: {
    user: "academy@hilltotown.com", // Replace with your SMTP username
    pass: "Academy@2024!", // Replace with your SMTP password
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

// Define email options

// to get the data
router.get("/signinusers", async (req, res) => {
  const category = await UserModel.find();
  res.send(category);
});
// to request & response to the api and database /  signin

router.post("/signup", async (req, res) => {
  const { error } = validatelogining(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json("Passwords Doesn't Match");
    }
    const poster = new UserModel(req.body);
    const result = await poster.save();
    console.log(result);
    res.send("created successfully");
  } catch (error) {
    console.log(error);
  }
});

// to request & response to the api and database /  login

router.post("/login", async (req, res) => {
  // handling the err for the joi

  const { error } = validateLogin(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { email, password } = req.body;
  const Logining = await UserModel.findOne({ email, password });
  console.log(Logining);
  // In case dosen't match to it will be handle the error
  if (!Logining) {
    return res.status(400).send("Invalid Email Id & Password");
  }

  res.send("Logining Successfully");
});

// to request & response to the api and database /  forget password find the email and generate otp
router.post("/forget-password", async (req, res) => {
  const { email } = req.body;

  try {
    const forgetpwd = await UserModel.findOne({ email });
    if (!forgetpwd) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Mail Id" });
    }
    const otp = generateOTP();
    forgetpwd.resetPasswordOTP = otp;
    forgetpwd.otp = otp;
    console.log("Generated OTP:", otp);
    const mailOptions = {
      from: "academy@hilltotown.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `<p>Your OTP for password reset is: ${otp}
      Please use this OTP to reset your password.`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    const forget = await forgetpwd.save();
    console.log(forget);
    const resp = {
      success: true,
      email: forgetpwd.email,
    };

    res.send(resp);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

// to request & response to the api and database /  verify otp

router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  try {
    const verifyotp = await UserModel.findOne({ otp });
    if (!verifyotp) {
      return res.status(400).send({ success: false, message: "Invalid OTP" });
    }
    const resp = {
      success: true,
      userid: verifyotp._id,
    };
    res.send(resp);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

router.put("/reset-password/:id", async (req, res) => {
  const { password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json("Passwords Doesn't Match");
  }

  try {
    const updatepassword = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        password: req.body.password,
      },
      { new: true }
    );
    console.log(updatepassword);
    if (!updatepassword) return res.status(400).send("error");
    res.send("Password Updated Successfully");
  } catch (err) {
    console.log(err);
  }
});

// joi and validation function

function validatelogining(Logining) {
  const Schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string(),
  });
  const result = Schema.validate(Logining);
  return result;
}
function validateLogin(Logining) {
  const Schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = Schema.validate(Logining);
  return result;
}
module.exports = router;
