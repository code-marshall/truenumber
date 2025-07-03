"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const authService_1 = require("../services/authService");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authService_1.AuthService.extractTokenFromHeader(authHeader);
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access token required'
        });
        return;
    }
    const payload = authService_1.AuthService.verifyToken(token);
    if (!payload) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
        return;
    }
    req.user = payload;
    next();
};
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authService_1.AuthService.extractTokenFromHeader(authHeader);
    if (token) {
        const payload = authService_1.AuthService.verifyToken(token);
        if (payload) {
            req.user = payload;
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map