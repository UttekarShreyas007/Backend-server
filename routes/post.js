const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post"); 
const Media = require('../models/Media');

router.post("/create", authMiddleware, async (req, res) => {
  try {
    console.log(req.body, "reqssss")
    const { title, description, category, files } = req.body;
    const fileReferences = [];
    for (let file of files) {
      const { fileSize, fileName, fileType, fileUrl } = file;
      const fileObj = new Media({
        fileSize,
        fileName,
        fileType,   
        fileUrl
      });
      const savedFile = await fileObj.save();
      console.log(savedFile, "svd")
      fileReferences.push(savedFile._id);
    }

    const post = new Post({
      title,
      description,
      category,
      media: fileReferences
    });
    const savedPost = await post.save();

    res.json(savedPost);
  } catch (error) {
    console.log(error, "err")
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/get", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});



router.get('/allposts', async (req, res) => {
  try {
    const posts = await Post.find().populate('media');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('media');
    if (!post) {
      return res.status(404).send();
    }
    res.send({ post });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const post = await Post.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!post) {
      return res.status(404).send();
    }
    res.send({ post });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).send();
    }
    res.send({ post });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('files');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/allfiles', async (req, res) => {
  console.log(req, "reqqqqqqqqqq")
  try {
    const files = await Media.find();
    console.log(files, "files")
    if (files.length === 0) {
      return res.json({ message: 'No files found' });
    }
    
    res.json(files);
  } catch (error) {
    console.log(error, "errrrrrrrr");
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/files', async (req, res) => {
  try {
    const fileType = req.body.fileType;
    const files = await Media.find({ fileType });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/posts/:category', async (req, res) => {
  try {
    const category = req.params.category;

    const posts = await Post.find({ category }).populate('media');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
