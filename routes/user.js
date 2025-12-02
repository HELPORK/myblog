const express = require("express");
const User = require("../models/user")
const router =express.Router();
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./publice/images"));
  },
  filename: function (req, file, cb) {
        const fileName = `${Date.now}-${file.originalname}`;
        cb(null,fileName);
  }
});
const upload = multer({ storage: storage });

router.get("/signin",(req,res)=>{
    return res.render('signin');
});

router.get("/signup",(req,res)=>{
    return res.render('signup');
});

router.post("/signup" ,upload.single("profileImage"),async(req,res)=>{
    const {fullName,email,password}  = req.body;
    await User.create({
        fullName,
        email,
        password,
        profileImage : `/images/${req.file.filename}`
    });
 
const token =await User.matchPasswordAndGenerateToken(email,password);

    return res.cookie("token",token).redirect("/");
});

router.post("/signin", async(req,res)=>{
   const {email,password}  =  req.body;
try {
    const token =await User.matchPasswordAndGenerateToken(email,password);

return res.cookie("token" , token).redirect("/"); 
    
} catch (error) {
    return res.render("signin",{
        error :" incorrect email or password"
    });
}
});


router.get("/logout",(req,res)=>{
  return  res.clearCookie("token").redirect('/');
})

module.exports = router;