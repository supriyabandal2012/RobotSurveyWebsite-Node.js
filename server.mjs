// server.mjs
import express from 'express';
import cors from 'cors';
import { connect, Schema, model } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const { MONGO_URI } = process.env;

connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema for pre-survey data
const preSurveySchema = new Schema({
  age: String,
  gender: String,
  country: String,
  familiarityWithRobots: String,
  preferRobotsOverHumans: String,
});

// Create a model for pre-survey data
const PreSurveyResponse = model('PreSurveyResponse', preSurveySchema);

// Define schema for survey data
const responseSchema = new Schema({
  set: Number,
  question: String,
  response: Number,
});

// Create a model for survey data
const Response = model('Response', responseSchema);

// Define schema for post-survey data
const postSurveySchema = new Schema({
  satisfactionRating: String,
  findRobotsInteresting: String,
  preferRobotsOverHumans: String,
  additionalComments: String,
});

// Create a model for post-survey data
const PostSurveyResponse = model('PostSurveyResponse', postSurveySchema);

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Routes
app.get('/api/responses', async (req, res) => {
  try {
    const responses = await Response.find();
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responses', error: error.message });
  }
});

// Route to handle pre-survey data
app.post('/api/submit-pre-survey', async (req, res) => {
  const preSurveyData = req.body;

  console.log('Received pre-survey data:', preSurveyData);

  try {
    await PreSurveyResponse.create(preSurveyData);

    res.json({ message: 'Pre-survey response submitted successfully!' });
  } catch (error) {
    console.error('Error submitting pre-survey response:', error);
    res.status(500).json({ message: 'Error submitting pre-survey response', error: error.message });
  }
});

// Route to handle survey data
app.post('/api/submit-survey', async (req, res) => {
  const submittedResponses = req.body.submittedResponses;

  console.log('Received survey data:', submittedResponses);

  try {
    await Response.insertMany(submittedResponses);

    res.json({ message: 'All survey responses submitted successfully!' });
  } catch (error) {
    console.error('Error submitting all survey responses:', error);
    res.status(500).json({ message: 'Error submitting all survey responses', error: error.message });
  }
});

// Route to handle post-survey data
app.post('/api/submit-post-survey', async (req, res) => {
  const postSurveyData = req.body;

  console.log('Received post-survey data:', postSurveyData);

  try {
    await PostSurveyResponse.create(postSurveyData);

    res.json({ message: 'Post-survey response submitted successfully!' });
  } catch (error) {
    console.error('Error submitting post-survey response:', error);
    res.status(500).json({ message: 'Error submitting post-survey response', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
