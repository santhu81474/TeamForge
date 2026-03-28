require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api/health', (req, res) => res.json({ message: 'Server is running normally' }));

// Route Mappings
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillnetwork';

// Debug: verify that MONGO_URI is loaded from environment
console.log('ENV CHECK:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
console.log('Using MONGO_URI value:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Mongo error:', err));

app.listen(PORT, () => console.log(`Server safely started on port ${PORT}`));
