const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validateEmail } = require("../utils/validateForm");

exports.signUp = async (req, res) => {
  try {
    const { fName, lName, email, password, confirmPassword } = req.body;
    // making sure all fields are filled
    if (!fName || !email || !password || !confirmPassword)
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });

    if (!validateEmail(email))
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    // comparing password and confirm password
    if (password.length < 5)
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 5 characters long",
      });
    if (password !== confirmPassword)
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password didn't match",
      });

    // checking DB
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });

    // hashing password
    let hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName: fName,
      lastName: lName,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      message: "User registered Successfully",
      createdUser: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while signing up",
      error: error.message,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });

    if (!validateEmail(email))
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });

    // comparing password with correct password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });

    // generating token
    const payload = {
      id: existingUser._id,
      email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // saving token into cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending response to client
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while signing in",
      error: error.message,
    });
  }
};

exports.signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging out",
    });
  }
};
