import { Router } from 'express';

import companyRouter from '../routes/company.js';

const router = Router()

//shift this to admin routes later
router.use('/company',companyRouter);

export default router;