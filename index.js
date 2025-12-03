require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookies } = require("./middleware/authentication");
const Blog = require("./models/blog");

const port = process.env.PORT || 8002;
///Do edit here before pushing

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("mongodb is connected now ||"));


app.set("view engine" , "ejs");
app.set("viw" , path.resolve("./views"));
//form data middleware

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));
app.use(express.static(path.resolve("./publice")));

app.get("/",async(req,res)=>{
   const allBlogs = (await Blog.find({}));
   return  res.render('home',{
        user: req.user,
        blogs : allBlogs ,
       });
});
app.use("/user",userRoute);
app.use("/blog",blogRoute);


app.listen(port , ()=> console.log(`server started at port :${port}`));