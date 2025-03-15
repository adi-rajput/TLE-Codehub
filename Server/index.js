const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { dbConfig } = require('./config/db_config.js')
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3000

app.listen(PORT , () =>{
    dbConfig();
    console.log(`Server is running in ${PORT}`)
})