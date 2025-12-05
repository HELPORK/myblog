const express = require("express");
const User = require("../models/blog")
const multer = require("multer");
const path = require("path");
const router =express.Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
//image uploader 
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./publice/uploads"));
  },
  filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
  }
})
*/
const { storage } = require("../cloudinary");
const upload = multer({ storage: storage });


router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user: req.user,
    });
   

});


router.get("/:_id",async(req,res)=>{
const blog = await Blog.findById(req.params._id).populate("createdBy");
const comments = await Comment.find({blogId: req.params._id}).populate("createdBy");
      return res.render("blog",{
        user:req.user,
         blog,
         comments,
      });
      
});

router.post("/",upload.single("coverImage"),async(req,res)=>{
 const {title,body} = req.body;
  const blog = await  Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL:req.file.path,
   });
    return res.redirect(`/blog/${blog._id}`);
});


router.post("/comment/:blogId" ,async(req,res)=>{
const comment = await Comment.create({
  content : req.body.content,
  blogId: req.params.blogId,
  createdBy: req.user._id,
});
return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router ;