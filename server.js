import express from 'express';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';

import userRouter from './routers/userController.js';
import taskRouter from './routers/taskController.js';
import companyRouter from './routers/companyController.js';

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // Initialize WebSocket server

// Middleware
app.use(cors({
  origin: '*', // Replace '*' with your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

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

const port = 3000;
server.listen(port, () => {
  console.log(`UnityNest Server listening on port ${port}`);
});
