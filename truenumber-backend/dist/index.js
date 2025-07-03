"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const companies_1 = __importDefault(require("./routes/companies"));
const verification_1 = __importDefault(require("./routes/verification"));
const otpService_1 = require("./services/otpService");
const VerificationRequest_1 = require("./models/VerificationRequest");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TrueNumber Backend API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/companies', companies_1.default);
app.use('/api/verification', verification_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});
const runCleanupTasks = async () => {
    try {
        console.log('Running cleanup tasks...');
        const expiredOTPs = await otpService_1.OTPService.cleanupExpiredOTPs();
        console.log(`Cleaned up ${expiredOTPs} expired OTP records`);
        const expiredRequests = await VerificationRequest_1.VerificationRequestModel.markExpired();
        console.log(`Marked ${expiredRequests} verification requests as expired`);
    }
    catch (error) {
        console.error('Error running cleanup tasks:', error);
    }
};
const CLEANUP_INTERVAL = 30 * 60 * 1000;
setInterval(runCleanupTasks, CLEANUP_INTERVAL);
runCleanupTasks();
process.on('SIGINT', () => {
    console.log('Received SIGINT. Graceful shutdown...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Graceful shutdown...');
    process.exit(0);
});
app.listen(PORT, () => {
    console.log(`TrueNumber Backend API server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map