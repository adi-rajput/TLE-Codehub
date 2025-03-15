const authorizeAdmin = (req, res, next) => {
  console.log("User Info in authorizeAdmin:", req.user); 
  
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

module.exports = authorizeAdmin;
