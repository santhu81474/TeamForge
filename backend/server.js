require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Global Middleware
app.use(cors({
  origin: [
    "https://teamforge-frontend-ff1k68pn4-santhoshkuar18-6464s-projects.vercel.app",
    "https://teamforge-frontend-six.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});
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


console.log('ENV CHECK:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
console.log('Using MONGO_URI value:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server safely started on port 5000');
    });
  })
  .catch(err => {
    console.log('Mongo error:', err);
  });
