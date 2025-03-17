const express  = require('express')
const router = express.Router()

const {getActiveContests, LeetCodeContest , CodechefContest ,   CodeforcesContest , getPastContests} = require('../controller/Contest_Controller') 
const {fetchContests, updateContestStatus} = require('../controller/Contest_Controller')
router.get('/active-contests', getActiveContests)
router.get('/leetcode-contests', LeetCodeContest)
router.get('/codechef-contests', CodechefContest)
router.get('/codeforces-contests', CodeforcesContest)
router.get('/past-contests', getPastContests)

module.exports = router