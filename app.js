
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

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
app.get("/error", (req, res)=>{
  res.render("error")
})
app.get("/forms", (req, res) => {
  res.render("forms");
});
app.get("/sign-in", (req, res)=>{
  res.render("sign-in")
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
                // console.log(req.body);
                if (error) {
                  res.render("error");
                } else {
                  res.render("signin")
                }
              }
            );
          });
        }
      }
    }
  );
});

app.post("/sign-in", (req,res)=>{
  con.query("SELECT * FROM users WHERE email = ?", [req.body.email], (error, currentUser)=>{
    // console.log(currentUser)
    // console.log(currentUser[0])
    // console.log(currentUser[0].password)
    if(error){
      res.status(500).render("error")
      console.log("there is an error")
    }else{
      bcrypt.compare(req.body.password, currentUser[0].password, (error, match)=>{
        if(error){
          req.status(500).render("error")
        }else{
          if(match){
            res.render("user")
          }else{
            req.render("sign-in", {error: "Wrong Password"})
          }
        }
      })
    }
  })
})
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
