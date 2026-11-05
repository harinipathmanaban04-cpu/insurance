import { Router } from 'express';
import {
  submitApplication,
  listApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';

const router = Router();

router.post('/submit', submitApplication);
router.get('/', listApplications);
router.patch('/:id/status', updateApplicationStatus);

export default router;
