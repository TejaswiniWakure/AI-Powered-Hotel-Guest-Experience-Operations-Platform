require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/services/socketService');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time operations
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

initSocket(io);

// Make io accessible in req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'StayFlow API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/manager', require('./src/routes/manager'));
app.use('/api/staff', require('./src/routes/staff'));
app.use('/api/guest', require('./src/routes/guest'));
app.use('/api/ai', require('./src/routes/ai'));
app.use('/api/notifications', require('./src/routes/notifications'));

// Legacy compatibility routes
app.use('/api/requests', require('./src/routes/requests'));
app.use('/api/tasks', require('./src/routes/tasks'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('StayFlow Hotel Operations API is running.');
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'An unexpected server error occurred'
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`StayFlow Server running on port ${PORT}`);
});
