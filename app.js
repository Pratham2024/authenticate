require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

const mongoose = require('mongoose');// Requiring of package

// Connecting to DB
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/userDB");
}

// Schema------->>>>>

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});



const User = new mongoose.model("User",userSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/",(req,res)=>{
  res.render("home");
})

app.get("/login",(req,res)=>{
  res.render("login");
})

app.get("/register",(req,res)=>{
  res.render("register");
})

app.post("/register",(req,res)=>{
  const newUser = new User({
    email:req.body.username,// yahan req.body ke sath name store krte hai!!
    password:req.body.password
  })
  newUser.save((err)=>{
    if(!err){
      res.render("secrets")
    }else{
      console.log(err)
    }
  })
});

app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username},(err, foundUser)=>{
    if(err){
      console.log(err)
    }else{
      if(foundUser.password === password){
        res.render("secrets")
      }
    }
  })

});

app.listen(3000,()=>{
  console.log("server started on port 3000")
})
