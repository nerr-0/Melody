const express = require("express")
const bcrypt = require("bcrypt")
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.render("home")
})

app.listen(PORT, ()=>{
    console.log("LISTENING ON PORT 3000")
}) 