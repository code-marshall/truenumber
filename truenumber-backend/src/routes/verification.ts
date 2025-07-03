import { Router } from 'express';
import { VerificationController } from '../controllers/verificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route POST /api/verification/request
 * @desc Create a new verification request
 * @access Public
 */
router.post('/request', VerificationController.createVerificationRequest);

/**
 * @route GET /api/verification/pending
 * @desc Get pending verification requests for authenticated user
 * @access Private
 */
router.get('/pending', authenticateToken, VerificationController.getPendingRequests);

/**
 * @route PUT /api/verification/:id/status
 * @desc Update verification request status
 * @access Private
 */
router.put('/:id/status', authenticateToken, VerificationController.updateRequestStatus);

/**
 * @route GET /api/verification/:id
 * @desc Get verification request by ID
 * @access Public
 */
router.get('/:id', VerificationController.getVerificationRequest);

/**
 * @route GET /api/verification/company/:company_id
 * @desc Get verification requests for a specific company
 * @access Public
 */
router.get('/company/:company_id', VerificationController.getCompanyRequests);

/**
 * @route POST /api/verification/mark-expired
 * @desc Mark expired verification requests (should be called periodically)
 * @access Public (should be restricted in production)
 */
router.post('/mark-expired', VerificationController.markExpiredRequests);

export default router;