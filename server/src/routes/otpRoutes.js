import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/otpController.js';
import { otpRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/send', otpRateLimiter, sendOtp);
router.post('/verify', verifyOtp);

export default router;
