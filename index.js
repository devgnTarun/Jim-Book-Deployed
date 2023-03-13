const conectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const path = require('path')


//Config 
if(process.env.NODE_ENV !== "PRODUCTION"){
  require('dotenv').config({path : "Backend/config/config.env"})
}


const app = express()
const port = process.env.PORT


app.use(cors())
app.use(express.json());

conectToMongo();

app.use('/api/auth' , require('./Routes/auth'))
app.use('/api/notes' , require('./Routes/notes'))

app.use(express.static(path.join(__dirname , './jimbook/build')))

app.get("*" , (req , res ) => {
    res.sendFile(path.resolve(__dirname , './jimbook/build/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})