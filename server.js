const express = require('express');
const cors = require('cors');
const http = require('http'); // For creating an HTTP server
const { Server } = require('socket.io'); // Import socket.io
const rootRouter = require("./routes/index");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // Initialize WebSocket server

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRouter);

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
