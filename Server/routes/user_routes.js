const express = require  ('express')
const router = express.Router()

const {register, login , bookmarks , addSolutionLink} = require('../controller/user_controller')
const authenticateUser = require('../middlewares/authenticated')
const authorizeAdmin = require('../middlewares/authorize_user')
router.post('/register', register)
router.post('/login', login)
router.get('/bookmarks', authenticateUser, bookmarks)
router.put('/add-solution-link/:contestId', authenticateUser , addSolutionLink)

module.exports = router