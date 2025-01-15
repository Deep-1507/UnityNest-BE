import { Router } from 'express';

import userRouter from '../routes/user.js';
import messagesRouter from '../routes/message.js';

const router = Router()

router.use('/user',userRouter);
router.use('/messages',messagesRouter);

export default router;