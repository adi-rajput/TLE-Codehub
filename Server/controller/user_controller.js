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
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const getUser = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/user/me", {
//       method: "GET",
//       credentials: "include", 
//     });

//     if (!response.ok) {
//       throw new Error("Not authenticated");
//     }

//     const data = await response.json();
//     return data.user; // Return the user object
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return null; // Return null if user is not authenticated
//   }
// };

const toggleBookmark = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId).populate("bookmarks");
    if (!user) return res.status(404).json({ message: "User not found" });

    const contestIdStr = String(contestId); // Ensure string comparison

    // Find if the contest is already bookmarked
    const index = user.bookmarks.findIndex(contest => String(contest._id) === contestIdStr);

    if (index === -1) {
      user.bookmarks.push(contestIdStr);
    } else {
      user.bookmarks.splice(index, 1);
    }

    await user.save();

    // Re-populate bookmarks after modification
    const updatedUser = await User.findById(userId).populate("bookmarks");

    res.json({ bookmarks: updatedUser.bookmarks });
  } catch (error) {
    console.error("Bookmark Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("bookmarks");
    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error("Get Bookmarks Error:", error);
    res.status(500).json({ message: "Server error" });
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


module.exports = { register, login, toggleBookmark, getBookmarks , addSolutionLink };
