const User = require("../models/user_models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const register = async (req, res) => {
  try {
    const { name, email, password , role } = req.body;
    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role
    });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("User registration failed:", error);
    res.status(500).json({
      message: "User registration failed",
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
        email,
        });
    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials",
        });
        }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials",
        });
        }   
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
          httpOnly: true,
        });
    
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
    console.error("User login failed:", error);
    res.status(500).json({
        message: "User login failed",
    });
    }
}
const bookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("bookmarks");  
    res.status(200).json(user.bookmarks);
  } catch (error) {
    console.error("Fetching bookmarks failed:", error);
    res.status(500).json({
      message: "Fetching bookmarks failed",
    });
  }
};
module.exports = { register, login , bookmarks };