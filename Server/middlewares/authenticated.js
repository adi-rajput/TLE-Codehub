const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //console.log("Decoded Token:", decoded);  

    req.user = { id: decoded.userId, role: decoded.role };

    //console.log("User info in req.user:", req.user);  

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};


module.exports = authenticateUser;
