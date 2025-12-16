const express = require("express");
const User = require("../models/user")
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
router.get("/search", async (req, res) => {
  const query = req.query.q;
  
  console.log("SEARCH QUERY =",query);
  try {
    // Search blogs by title
    const blogs = await Blog.find({
      title: { $regex: query, $options: "i" }
    }).populate("createdBy");

    // Search users by name
    const users = await User.find({
      fullName: { $regex: query, $options: "i" }
    });

    // Search blogs by matched users
    let userBlogs = [];
    if (users.length > 0) {
      const userIds = users.map(u => u._id);
      userBlogs = await Blog.find({
        createdBy: { $in: userIds }
      }).populate("createdBy");
    }

    res.render("search", {
      query,
      blogs,
      userBlogs
    });

  } catch (err) {
    console.log(err);

    res.render("search", {
      query,
      blogs: [],
      userBlogs: []
    });
  }
});
/*

router.get("/search",async(req,res)=>{
const query = req.query.q;
console.log("Search is " , query);

const result = await Blog.find({
  name:{$regex:query,$options:"i"}
});
res.send(result);
});
*/

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