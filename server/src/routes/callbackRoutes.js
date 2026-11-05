import { Router } from 'express';
import { submitCallback } from '../controllers/callbackController.js';

const router = Router();

router.post('/', submitCallback);

export default router;
