const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/myDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define User schema and model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// Sign Up route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('User created');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).send('Login successful');
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

// Quiz Schema and Model
const quizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: String
    }
  ]
});

const Quiz = mongoose.model('Quiz', quizSchema);

// Fetch All Quizzes
app.get('/quizze', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).send('Error fetching quizzes');
  }
});

// Add New Quiz
app.post('/quizzes', async (req, res) => {
  const { title } = req.body;
  try {
    const newQuiz = new Quiz({ title, questions: [] });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(500).send('Error creating quiz');
  }
});

// Add Question to Quiz
app.post('/quizzes/:id/questions', async (req, res) => {
  const { id } = req.params;
  const { question, options, answer } = req.body;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    quiz.questions.push({ question, options, answer });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).send('Error adding question');
  }
});

// Fetch Quiz by Title with Detailed Logging
app.get('/quizzes', async (req, res) => {
  const quizName = req.query.title;
  console.log(`Received request for quiz: ${quizName}`); // Log the quiz name received
  try {
    const quiz = await Quiz.findOne({ title: quizName });
    if (quiz) {
      console.log('Quiz found:', quiz); // Log the quiz found
      res.json(quiz);
    } else {
      console.log('Quiz not found'); // Log if the quiz is not found
      res.status(404).send('Quiz not found');
    }
  } catch (err) {
    console.error('Error fetching quiz:', err); // Log any errors
    res.status(500).send('Error fetching quiz');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
