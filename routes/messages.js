import express from "express";
import { z as zod } from "zod"; // Named import for Zod
import { Messages } from "../db.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

const messageBody = zod.object({
  receiverId: zod.string(),
  message: zod.string(),
});

router.post("/send-message", authMiddleware, async (req, res) => {
  try {
    const {receiverId, message } = req.body;
    const senderId = req.userId;

    if(!senderId || !receiverId){
      return res
      .status(406)
      .json({
        message:"SenderId or ReceiverId cannot be empty"
      })
    }

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
      companyId,
      message,
      timestamp: new Date(),
    });

    const io = req.app.get("io");
    const receiverSocketId = io.connectedUsers?.get(receiverId);

    // Emit message through WebSocket
    io.emit("sendMessage", {
      senderId,
      receiverId,
      companyId,
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

    const senderId = req.userId;
    const receiverId = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "SenderId and ReceiverId are required." });
    }

    const messages = await Messages.find({
      $and:[{
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ]
      },
      {
        companyId:req.companyId,
      }
      ]
    });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found." });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "An error occurred while fetching messages." });
  }
});

export default router;