import { Router } from 'express';
import { submitEnquiry, listEnquiries } from '../controllers/enquiryController.js';
import { enquiryRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', enquiryRateLimiter, submitEnquiry);
router.post('/submit', enquiryRateLimiter, submitEnquiry);
router.get('/', listEnquiries);

export default router;
