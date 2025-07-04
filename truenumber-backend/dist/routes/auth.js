"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/send-otp', authController_1.AuthController.sendOTP);
router.post('/verify-otp', authController_1.AuthController.verifyOTP);
router.get('/profile', auth_1.authenticateToken, authController_1.AuthController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map