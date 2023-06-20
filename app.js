const express = require("express")
const bcrypt = require("bcrypt")
const app = express()
const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log("LISTENING ON PORT 3000")
})