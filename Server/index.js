const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { dbConfig } = require('./config/db_config.js')
const  fetchCodechef  = require('./controller/fetch_codechef.js')
const  fetchCodeforces  = require('./controller/fetch_codeforces.js')   
const  fetchLeetCodeContests  = require('./controller/fetch_leetcode.js')
const  {updateContestStatus}  = require('./controller/Contest_Controller.js')
const userRouter = require('./routes/user_routes.js')
const contestRouter = require('./routes/contest_routes.js')
const {contestCron } = require('./utils/contest_cron.js')
dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());
//app.use(cors());
app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true,
    })
  );

const PORT = process.env.PORT || 3000

app.listen(PORT , () =>{
    //fetchLeetCodeContests();
    dbConfig();
    console.log(`Server is running in ${PORT}`)
    //fetchCodechef();
    //fetchCodeforces();  
    
    contestCron();
})
app.use('/user', userRouter)
app.use('/contests', contestRouter)
updateContestStatus();