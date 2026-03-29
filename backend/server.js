require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"]
  }
});

// Global Middleware
app.use(cors({
  origin: [
    "https://teamforge-frontend-ff1k68pn4-santhoshkuar18-6464s-projects.vercel.app",
    "https://teamforge-frontend-six.vercel.app",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ],
  credentials: true
}));
app.use(express.json());

// Route Mappings
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/snippets', require('./routes/snippetRoutes'));

// SPA Catch-all: Serve frontend dist if it exists, otherwise provide 404 for unknown API
const distPath = path.join(__dirname, '../dist');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(distPath));
app.use(express.static(publicPath));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[404] API Not Found: ${req.url}`);
    return res.status(404).json({ message: 'API Endpoint not found' });
  }
  
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If index.html is missing, the build might be incomplete
      console.log(`[404] SPA Index Not Found at ${indexPath}. Falling back to 404.`);
      res.status(404).send('Frontend not built. Please run npm run build if using this port.');
    }
  });
});

// Global Error Handler
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('New user connected to Terminal Forge');

  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`User joined project node: ${projectId}`);
  });

  socket.on('send_message', (data) => {
    // data: { projectId, sender, text }
    io.to(data.projectId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from node');
  });
});


console.log('ENV CHECK:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
console.log('Using MONGO_URI value:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log('TeamForge Backend Protocol Active on Port 5000 ⚡');
    });
  })
  .catch(err => {
    console.log('Mongo error:', err);
  });
