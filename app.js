require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser:true});

const userSchema= mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields:["password"]});

const User= new mongoose.model("user",userSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    }
    else{
      res.render("secrets")
    }
  });
});
app.post("/login",function(req,res){
  const username =req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets")
        }
        else{
          console.log("wrong password");
        }
      }
    }
  })


});

const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}.`));
