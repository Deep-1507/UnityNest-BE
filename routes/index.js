const express = require('express')
const userRouter = require('./user')
const taskRouter = require('./task')
const adminRouter = require('./admin')
const messageRouter = require('./message.js')
const messagesRouter = require('./messages.js')

const router=express.Router();
 
router.use('/user',userRouter);
router.use('/task',taskRouter);
router.use('/admin',adminRouter);
router.use('/message',messageRouter);
router.use('/messages',messagesRouter);

module.exports = router;