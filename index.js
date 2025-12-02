const express = require("express");
const app = express();
const path = require('path');
const port = 8002 ;
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookies } = require("./middleware/authentication");
const Blog = require("./models/blog");


mongoose.connect( "mongodb://127.0.0.1:27017/myblog")
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


app.listen(port , ()=> console.log(`server started at port :${port}`))