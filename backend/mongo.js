const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Import and configure dotenv

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};
connectDB();

// Define User schema and model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Sign Up Route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('User created');
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Error creating user');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    res.status(200).send('Login successful');
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
});

// Quiz Schema and Model
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      answer: { type: String, required: true },
    },
  ],
});

const Quiz = mongoose.model('Quiz', quizSchema);

// Fetch All Quizzes
app.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).send('Error fetching quizzes');
  }
});

// Add New Quiz
app.post('/quizzes', async (req, res) => {
  try {
    const { title } = req.body;
    const newQuiz = new Quiz({ title, questions: [] });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).send('Error creating quiz');
  }
});

// Add Question to Quiz
app.post('/quizzes/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, answer } = req.body;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    quiz.questions.push({ question, options, answer });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error('Error adding question:', err);
    res.status(500).send('Error adding question');
  }
});

// Fetch Quiz by Title
app.get('/quizzes/search', async (req, res) => {
  try {
    const { title } = req.query;
    const quiz = await Quiz.findOne({ title });
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    res.json(quiz);
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).send('Error fetching quiz');
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});