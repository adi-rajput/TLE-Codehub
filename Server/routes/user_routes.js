const express = require('express')
const router = express.Router()
const User = require('../models/user_models')
const {register, login , toggleBookmark, getBookmarks , addSolutionLink} = require('../controller/user_controller')
const {authenticateUser} = require('../middlewares/authenticated')
const authorizeAdmin = require('../middlewares/authorize_user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

router.post('/register', register)
router.post('/login', login)
router.put('/toggle-bookmark/:contestId', authenticateUser, toggleBookmark)
router.get('/bookmarks', authenticateUser, getBookmarks)
router.put('/add-solution-link/:contestId', authenticateUser , addSolutionLink)

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" })
  }
}

router.get("/me", verifyToken , async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })

    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  })

  return res.status(200).json({ message: "Logged out successfully" })
})

module.exports = router
