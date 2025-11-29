const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for now, restrict in prod
  },
});

app.use(cors());
app.use(express.json());

// User Socket Mapping
const userSocketMap = new Map(); // userId -> socketId

// Socket.io Middleware for Auth (Optional)
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
      if (!err && decoded) {
        socket.userId = decoded.userId;
        userSocketMap.set(decoded.userId, socket.id);
        console.log(`User ${decoded.userId} authenticated on socket ${socket.id}`);
      }
    });
  }
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      userSocketMap.delete(socket.userId);
    }
  });
});

// Make io and userSocketMap accessible in routes
app.set('io', io);
app.set('userSocketMap', userSocketMap);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neighbournet')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { io, userSocketMap, app };
