import { Router } from 'express';
import { submitEnquiry, listEnquiries } from '../controllers/enquiryController.js';
import { submitApplication } from '../controllers/applicationController.js';
import { enquiryRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', enquiryRateLimiter, submitEnquiry);
router.post('/submit', enquiryRateLimiter, submitApplication);
router.get('/', listEnquiries);

export default router;
