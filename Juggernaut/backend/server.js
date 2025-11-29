require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
// Increase payload limit for images
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- HTTP SERVER WRAPPER ---
const server = http.createServer(app); 

// --- SOCKET.IO SETUP ---
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`⚡ User Connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

// --- API ROUTES ---
// 1. AUTHENTICATION (This was missing!)
app.use('/api/auth', require('./routes/authRoutes')); 

// 2. COMMUNITY REPORTS
app.use('/api/reports', require('./routes/reportRoutes'));

// 3. AI SCANS (Pest/Disease)
app.use('/api/scans', require('./routes/scanRoutes'));

// 4. SUPPLY CHAIN PRODUCTS
app.use('/api/products', require('./routes/productRoutes'));

// 5. GOOGLE VISION (Label Reading)
app.use('/api/vision', require('./routes/visionRoutes'));

app.get('/', (req, res) => {
  res.send('Agri Sentry API is running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));