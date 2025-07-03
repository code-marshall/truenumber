"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificationController_1 = require("../controllers/verificationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/request', verificationController_1.VerificationController.createVerificationRequest);
router.get('/pending', auth_1.authenticateToken, verificationController_1.VerificationController.getPendingRequests);
router.put('/:id/status', auth_1.authenticateToken, verificationController_1.VerificationController.updateRequestStatus);
router.get('/:id', verificationController_1.VerificationController.getVerificationRequest);
router.get('/company/:company_id', verificationController_1.VerificationController.getCompanyRequests);
router.post('/mark-expired', verificationController_1.VerificationController.markExpiredRequests);
exports.default = router;
//# sourceMappingURL=verification.js.map