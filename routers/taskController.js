import { Router } from 'express';

import taskRouter from '../routes/task.js';
import messageRouter from '../routes/messages.js';

const router = Router()

router.use('/task',taskRouter);
router.use('/messages',messageRouter);

export default router;