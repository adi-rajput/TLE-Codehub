const express  = require('express')
const router = express.Router()

const {getActiveContests, LeetCodeContest , CodechefContest ,   CodeforcesContest} = require('../controller/Contest_Controller') 

router.get('/active-contests', getActiveContests)
router.get('/leetcode-contests', LeetCodeContest)
router.get('/codechef-contests', CodechefContest)
router.get('/codeforces-contests', CodeforcesContest)

module.exports = router