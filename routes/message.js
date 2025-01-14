import express from "express";
import { z } from "zod";
import { Message } from "../db.js";
import { JWT_SECRET } from "../config.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

const messageBody = z.object({
    senderId: z.string().min(1),
    receiverId: z.string().min(1),
    senderName: z.string().min(1),
    receiverName: z.string().min(1),
    message: z.string().min(1)
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
        receiverId: req.body.receiverId,
        senderName: req.body.senderName,
        receiverName: req.body.receiverName,
        message: req.body.message,
        creationDate: new Date(),
        status: 0,
    });

    res.json({
        message: "Message Sent Successfully",
    });
});

router.get("/get-messages", authMiddleware, async (req, res) => {
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
});

export default router;