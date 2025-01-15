import express from 'express';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';
import 'dotenv/config';
import mongoose from 'mongoose';

import userRouter from './controllers/userController.js';
import taskRouter from './controllers/taskController.js';
import companyRouter from './controllers/companyController.js';

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // Initialize WebSocket server

// Middleware
app.use(cors({
  origin: '*', // Replace '*' with your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//Put it on when project is finished

// app.use(cors({
//   origin: ['http://localhost:3000', 'https://your-production-domain.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true, // Enable if needed
// }));


app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>console.log('Connected to the Database'))
.catch((error) => console.log('Error Connecting to Databse',error))


//routing
app.use("/api/v1", userRouter);
app.use("/api/v2", taskRouter);
app.use("/api/v3", companyRouter);

// WebSocket Integration
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });

  socket.on('sendMessage', (message) => {
    const receiverSocketId = connectedUsers.get(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    connectedUsers.forEach((value, key) => {
      if (value === socket.id) connectedUsers.delete(key);
    });
  });
});

// Attach `io` to the app object for access in routes
app.set('io', io);

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`UnityNest Server listening on port ${port}`);
});
