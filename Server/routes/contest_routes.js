const express  = require('express')
const router = express.Router()

const {getActiveContests} = require('../controller/Contest_Controller') 

router.get('/active-contests', getActiveContests)
