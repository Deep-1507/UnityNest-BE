const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Messages } = require("../db");
const { authMiddleware } = require("../middleware");

const messageBody = zod.object({
  senderId: zod.string(),
  receiverId: zod.string(),
  message: zod.string(),
});

router.post("/send-message", authMiddleware, async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (senderId === receiverId) {
      return res
        .status(403)
        .json({ message: "SenderId and ReceiverId cannot be the same" });
    }

    const result = messageBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Input specified in incorrect format" });
    }

    const newMessage = await Messages.create({
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
    });

    const io = req.app.get('io');
    const receiverSocketId = io.connectedUsers?.get(receiverId);

    // Emit message through WebSocket
    io.emit('sendMessage', {
      senderId,
      receiverId,
      message,
      timestamp: newMessage.timestamp,
    });

    res.status(200).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error during message sending:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/show-messages", authMiddleware, async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'SenderId and ReceiverId are required.' });
    }

    const messages = await Messages.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found.' });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'An error occurred while fetching messages.' });
  }
});

module.exports = router;