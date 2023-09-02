
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const cookieParser = require("cookie-parser")
const sessions = require("express-session")

const app = express();

//set the view engine to ejs
app.set("view engine", "ejs");
//set the static folder holding the project files
app.use(express.static("public"));
//parsing the incoming data
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//cookie parser middleware
app.use(cookieParser())

//first, create 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 *24;
var session;

//session middlemware
app.use(sessions({
  secret: "vhbfvnjnjknbfvjhbsdjhbvjnhfdbv",
  saveUninitialized: true,
  cookie: {maxAge: oneDay},
  resave: false
}))
//The following code is the configuration for database connection
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
//below is code for express sessions options


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  // res.render("home");
  session = req.session;
  if(session.userId){
    res.render("user")
  }else{
    res.render("home")
  }
});
app.get("/error", (req, res)=>{
  res.render("error")
})
app.get("/about", (req, res)=>{
  res.render("about")
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
                  res.render("sign-in")
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
    console.log(currentUser[0])
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
            session = req.session;
            session.userId = req.body.name;
            // console.log(req.session)
            console.log(currentUser[0].name)
            let thisUser = currentUser[0]
            res.render("user", {thisUser})
          }else{
            req.render("sign-in", {error: "WRONG CREDENTIALS"})
          }
        }
      })
    }
  })
})
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
