const User = require("../models/user_models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Contest = require("../models/contest_model");
dotenv.config();
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
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
      role,
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id.toString(), role: user.role };
    //console.log("Payload Before Signing:", payload);

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });

    //console.log("Generated Token:", token);
    //console.log("Decoded Token After Signing:", jwt.decode(token)); 

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("User login failed:", error);
    res.status(500).json({ message: "User login failed" });
  }
};



const bookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("bookmarks");
    res.status(200).json(user.bookmarks);
  } catch (error) {
    console.error("Fetching bookmarks failed:", error);
    res.status(500).json({
      message: "Fetching bookmarks failed",
    });
  }
};

const addSolutionLink = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { solutionLink } = req.body;
    if(req.user.role !== "admin"){
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }
    if (!contestId || !solutionLink) {
      return res.status(400).json({
        success: false,
        message: "contestId and solutionLink are required.",
      });
    }
     
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    contest.solutionLink = solutionLink;
    await contest.save();

    res.status(200).json({
      success: true,
      message: "Solution link updated successfully.",
      data: contest,
    });
  } catch (error) {
    console.error("Error updating solution link:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


module.exports = { register, login, bookmarks , addSolutionLink};
