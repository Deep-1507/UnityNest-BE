const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Message } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware");

const messageBody = zod.object({
    senderId: zod.string().min(1),
    receiverId: zod.string().min(1),
    senderName: zod.string().min(1),
    receiverName: zod.string().min(1),
    message: zod.string().min(1)
  });
  
  router.post("/create-message", authMiddleware, async (req, res) => {

    const result = messageBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Input specified in incorrect format",
      });
    }
  
    const message = await Message.create({
        senderId: req.body.senderId,
        receiverId:  req.body. receiverId,
        senderName:  req.body.senderName,
        receiverName:  req.body.receiverName,
        message:  req.body.message,
        creationDate: new Date(),
        status: 0,
    });
  
    res.json({
      message: "Message Sent Successfully",
    });
  });

  router.get("/get-messages", authMiddleware, async (req,res) => {

    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
        return res.status(400).json({ message: 'senderId and receiverId are required' });
    }

    try {
        const messages = await Message.find({ senderId, receiverId });
        if (messages.length === 0) {
            return res.status(404).json({ message: 'No messages found' });
        }
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
  } )


module.exports = router;
