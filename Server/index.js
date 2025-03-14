const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3000

app.listen(PORT , () =>{
    console.log(`Server is running in ${PORT}`)
})