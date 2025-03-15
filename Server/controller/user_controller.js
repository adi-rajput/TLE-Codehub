const User = require("../models/user_models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config");

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
    const payload = {
        user: {
            id: user.id,
        },
    };  
    jwt.sign(payload, SECRET_KEY, { expiresIn: 3600 }, (error, token) => {
        if (error) throw error;
        res.status(200).json({
            token,
        });
    });
    } catch (error) {
    console.error("User login failed:", error);
    res.status(500).json({
        message: "User login failed",
    });
    }
}
module.exports = { register, login };