const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql")
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
})
con.connect((error)=>{
  if(error){
    res.render("error")
  }else{
    console.log("CONNECTED")
  }
})

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/forms", (req, res) => {
  res.render("forms");
});
app.listen(PORT, () => {
  console.log("LISTENING ON PORT 3000");
});
