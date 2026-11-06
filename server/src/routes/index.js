import { Router } from 'express';
import otpRoutes from './otpRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import { submitApplication, listApplications, updateApplicationStatus } from '../controllers/applicationController.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'THE BEST INSURANCE POINT API',
    timestamp: new Date().toISOString(),
  });
});

// Specific /enquiries endpoints for application submission and admin listing (mounted before generic /enquiries router)
router.post('/enquiries/submit', submitApplication);
router.get('/enquiries/list', listApplications);
router.patch('/enquiries/list', (req, res, next) => {
  req.params.id = req.body.applicationId;
  return updateApplicationStatus(req, res, next);
});

// Primary API Endpoints
router.use('/otp', otpRoutes);
router.use('/applications', applicationRoutes);
router.use('/enquiry', enquiryRoutes);
router.use('/enquiries', enquiryRoutes);

export default router;
