
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const myFunction() = require("public/views/home#script")

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
  con.query("SELECT * from users WHERE email = ?", [req.body.email], (error, results)=>{
    if(error){
      res.render("error")
    }else{
      
    }
  })
})

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
