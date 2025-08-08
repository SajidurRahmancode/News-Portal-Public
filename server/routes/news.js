// server/routes/news.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');




// server/routes/news.js (add this before the existing routes)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const query = { author: req.user.id };
    const options = {
      sort: { createdAt: -1 },
      populate: { path: 'author', select: 'username' }
    };
    
    const news = await News.find(query, null, options);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };

  const upload = multer({ 
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });
  

// Get all published news with pagination
router.get('/', async (req, res) => {
  try {
    const { category, limit = 10, page = 1, search, isPublished = true } = req.query;
    let query = {};
    
    // For non-authenticated users or regular users, only show published news
    if (!req.user || req.user.role !== 'admin') {
      query.isPublished = true;
    } else if (isPublished === 'false') {
      query.isPublished = false;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: { path: 'author', select: 'username' }
    };
    
    const news = await News.paginate(query, options);
    res.json({
      docs: news.docs,
      totalDocs: news.totalDocs,
      limit: news.limit,
      page: news.page,
      totalPages: news.totalPages,
      hasNextPage: news.hasNextPage,
      hasPrevPage: news.hasPrevPage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get top news
router.get('/top', async (req, res) => {
  try {
    const topNews = await News.find({ isPublished: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(6)
      .populate('author', 'username');
    
    res.json(topNews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single news
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'username email');
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Increment view count
    news.views += 1;
    await news.save();
    
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create news (authenticated users only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, isPublished } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content and category are required' });
    }
    
    // Convert string 'true'/'false' to boolean if needed
    const publishedStatus = typeof isPublished === 'string' 
      ? isPublished === 'true' 
      : Boolean(isPublished);
    
    const news = new News({
      title,
      content,
      category,
      author: req.user.id,
      isPublished: publishedStatus,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });
    
    await news.save();
    
    const populatedNews = await News.findById(news._id).populate('author', 'username');
    
    res.status(201).json(populatedNews);
  } catch (err) {
    console.error(err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update news (author only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, isPublished } = req.body;
    
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Check if user is the author
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this news' });
    }
    
    // Update fields
    if (title) news.title = title;
    if (content) news.content = content;
    if (category) news.category = category;
    if (isPublished !== undefined) news.isPublished = isPublished;
    
    // Update image if new one was uploaded
    if (req.file) {
      news.image = `/uploads/${req.file.filename}`;
    }
    
    await news.save();
    
    // Populate author info in response
    const populatedNews = await News.findById(news._id).populate('author', 'username');
    
    res.json(populatedNews);
  } catch (err) {
    console.error(err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete news (author or admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Check if user is the author or admin
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this news' });
    }
    
    await news.deleteOne();
    res.json({ message: 'News removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;