const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { dbConfig } = require('./config/db_config.js')
const  fetchCodechef  = require('./controller/fetch_codechef.js')
const  fetchCodeforces  = require('./controller/fetch_codeforces.js')   
const contestCron = require('./utils/contest_cron.js')
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3000

app.listen(PORT , () =>{
    dbConfig();
    console.log(`Server is running in ${PORT}`)
    contestCron();
})