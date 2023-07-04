const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post"); 
const Media = require('../models/Media');

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

router.get('/type', async (req, res) => {
  try {
    const fileType = req.body.fileType;
    const files = await Media.find({ fileType });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete', async (req, res) => {
    try {
      const fileId = req.body.fileId;
  
      // Find the file in the media collection
      const file = await Media.findById(fileId);
  
      if (!file) {
        return res.status(404).json({ error: 'Media not found' });
      }
  
      // Delete the file from the media collection
      await Media.findByIdAndRemove(fileId);
  
      // Find and update the post document to remove the file reference
      const post = await Post.findOneAndUpdate(
        { media: fileId },
        { $pull: { media: fileId } },
        { new: true }
      );
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json({ message: 'Media deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


module.exports = router;
