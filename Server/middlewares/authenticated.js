const jwt = require("jsonwebtoken");
const User = require("../models/user_models");

const authenticateUser = async (req, res, next) => {
  try {
    //console.log("Cookies:", req.cookies); // Debugging
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token found" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //console.log("Decoded User:", decoded); // Debugging

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { authenticateUser };
