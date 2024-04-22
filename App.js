const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const Article = require('./models/Article');
const Comment = require('./models/Comment');
const Rating = require('./models/Rating');
const Favorite = require('./models/Favorite');
const Category = require('./models/Category');
const cors = require('cors');

app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cnet_clone', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a new article (manual insertion into the database)
app.post('/articles', async (req, res) => {
    try {
      const article = new Article(req.body);
      await article.save();
      res.status(201).send(article);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // Get all articles
app.get('/articles', async (req, res) => {
    try {
      const articles = await Article.find();
      res.status(200).send(articles);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Get a single article by ID
app.get('/articles/:id', async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).send();
      }
      res.status(200).send(article);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Create a new comment
app.post('/comments', async (req, res) => {
    try {
      const comment = new Comment(req.body);
      await comment.save();
      res.status(201).send(comment);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // Get all comments for a specific article
app.get('/articles/:id/comments', async (req, res) => {
    try {
      const comments = await Comment.find({ articleID: req.params.id });
      res.status(200).send(comments);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Rating Routes
app.post('/ratings', async (req, res) => {
    try {
      const rating = new Rating(req.body);
      await rating.save();
      res.status(201).send(rating);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  app.get('/ratings', async (req, res) => {
    try {
      const ratings = await Rating.find();
      res.status(200).send(ratings);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Favorite Routes

// POST route to save a favorite article
app.post('/favorites', async (req, res) => {
    try {
      // Ensure that both userId and articleId are provided
      const { userId, articleId } = req.body;
      if (!userId || !articleId) {
        return res.status(400).send({ message: "UserId and ArticleId are required." });
      }
  
      // Check if this favorite already exists to prevent duplicates
      const existingFavorite = await Favorite.findOne({ userId, articleId });
      if (existingFavorite) {
        return res.status(400).send({ message: "Favorite already exists." });
      }
  
      // Create a new favorite entry
      const favorite = new Favorite({ userId, articleId });
      await favorite.save();
      res.status(201).send(favorite);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // GET route to get all favorites for a specific user
  app.get('/users/:userId/favorites', async (req, res) => {
    try {
      const { userId } = req.params;
      const favorites = await Favorite.find({ userId }).populate('articleId');
      // The populate method is assuming you have a reference to Article in your Favorite model
      res.status(200).send(favorites);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Category Routes
  app.post('/categories', async (req, res) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).send(category);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  app.get('/categories', async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).send(categories);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // User Update Route
  app.patch('/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // User Delete Route
  app.delete('/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.get('/articles/category/:categoryName', async (req, res) => {
    try {
      const articles = await Article.find({ categoryName: req.params.categoryName });
      res.status(200).send(articles);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.get('/users/:userId/ratings', async (req, res) => {
    try {
      const ratings = await Rating.find({ userID: req.params.userId });
      res.status(200).send(ratings);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/users/:userId/favorites', async (req, res) => {
    try {
      const favorites = await Favorite.find({ userID: req.params.userId });
      res.status(200).send(favorites);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  // User signup route
app.post('/signup', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({ message: "User already exists with this email." });
    }
    user = new User({
      username: req.body.username,
      email: req.body.email,
      passwordHash: req.body.password, // Storing the plaintext password (not recommended)
    });
    await user.save();
    res.status(201).send({
      _id: user._id,
      username: user.username,
      email: user.email,
      // Do not send back the password or passwordHash
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// User login route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "User not found with this email." });
    }
    // Since password is not hashed, we just compare the plaintext passwords
    if (user.passwordHash !== req.body.password) {
      return res.status(401).send({ message: "Password is incorrect." });
    }
    res.status(200).send({
      _id: user._id,
      username: user.username,
      email: user.email,
      // Do not send back the password or passwordHash
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

  
// Add other CRUD routes for User and other models

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
