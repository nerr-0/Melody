
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
// const myFunction() = require("public/views/home#script")
const {myFunction} = require("./public/scripts/functions.js")
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});
con.connect((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("CONNECTED");
  }
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/forms", (req, res) => {
  res.render("forms");
});
app.get("/sign-in", (req, res)=>{

})
app.post("/sign-up", (req, res) => {
  con.query(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    (error, results) => {
      if (error) {
        res.render("error");
      } else {
        if (results.length > 0) {
          res.render("forms", { error: "EMAIL ALREADY REGISTERED" });
        } else {
          bcrypt.hash(req.body.password, 5, function (err, hash) {
            con.query(
              "INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
              [req.body.name, req.body.email, hash],
              (error) => {
                console.log(req.body);
                if (error) {
                  res.render("error");
                } else {
                  res.render("forms", myFunction())
                }
              }
            );
          });
        }
      }
    }
  );
});
app.post("/sign-in", (req, res)=>{
  con.query("SELECT * FROM users WHERE email = ?", [req.body.email], (error, results)=>{
    console.log(results)
    if(error){
      res.render("error")
    }else{
      if(results>0){
        con.query("SELECT password FROM users WHERE email =?", [req.body.email], (error, userPassword)=>{
          console.log(userPassword)
          if(error){
            res.render("error")
          }else{
            bcrypt.compare(req.body.password, userPassword,(error, match)=>{
              if(error){
                res.render("forms", {error: "SOMETHING HAPPENED"})
              }else{
                if(match){
                  res.render("user", {message: "LOGIN SUCCESSFUL"})
                }else{
                  res.render("forms", {error: "WRONG PASSWORD"})
                }
              }
            })
          }
        })

      }else{
        res.render("forms", {error: "USER NOT REGISTERED"})
      }
    }
  })
})

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
