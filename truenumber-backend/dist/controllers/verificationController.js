"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationController = void 0;
const VerificationRequest_1 = require("../models/VerificationRequest");
const Company_1 = require("../models/Company");
const User_1 = require("../models/User");
class VerificationController {
    static async createVerificationRequest(req, res) {
        try {
            const { user_mobile_number, user_country_code, company_id, request_type = 'otp', expiry_hours = 24 } = req.body;
            if (!user_mobile_number || !user_country_code || !company_id) {
                res.status(400).json({
                    success: false,
                    message: 'User mobile number, country code, and company ID are required'
                });
                return;
            }
            const validRequestTypes = ['otp', 'number_selection'];
            if (!validRequestTypes.includes(request_type)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid request type'
                });
                return;
            }
            const company = await Company_1.CompanyModel.findById(company_id);
            if (!company) {
                res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
                return;
            }
            let user = await User_1.UserModel.findByMobileAndCountry(user_mobile_number, user_country_code);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found. Please register first.'
                });
                return;
            }
            const expiry_time = new Date(Date.now() + expiry_hours * 60 * 60 * 1000);
            const verificationRequest = await VerificationRequest_1.VerificationRequestModel.create({
                user_id: user.uid,
                company_id,
                request_type,
                status: 'user_action_pending',
                expiry_time
            });
            res.status(201).json({
                success: true,
                message: 'Verification request created successfully',
                verification_request: {
                    id: verificationRequest.id,
                    user_id: verificationRequest.user_id,
                    company_id: verificationRequest.company_id,
                    request_type: verificationRequest.request_type,
                    status: verificationRequest.status,
                    expiry_time: verificationRequest.expiry_time,
                    request_creation_date: verificationRequest.request_creation_date
                }
            });
        }
        catch (error) {
            console.error('Error in createVerificationRequest:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getPendingRequests(req, res) {
        try {
            const userId = req.user?.uid;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const pendingRequests = await VerificationRequest_1.VerificationRequestModel.findPendingByUserId(userId);
            res.status(200).json({
                success: true,
                requests: pendingRequests.map(request => ({
                    id: request.id,
                    company_id: request.company_id,
                    company_name: request.company_name,
                    domain: request.domain,
                    intent: request.intent,
                    request_type: request.request_type,
                    status: request.status,
                    expiry_time: request.expiry_time,
                    request_creation_date: request.request_creation_date
                })),
                total: pendingRequests.length
            });
        }
        catch (error) {
            console.error('Error in getPendingRequests:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateRequestStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const userId = req.user?.uid;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            if (!id || !status) {
                res.status(400).json({
                    success: false,
                    message: 'Request ID and status are required'
                });
                return;
            }
            const validStatuses = ['user_rejected', 'request_opened', 'completed'];
            if (!validStatuses.includes(status)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
                return;
            }
            const verificationRequest = await VerificationRequest_1.VerificationRequestModel.findById(id);
            if (!verificationRequest) {
                res.status(404).json({
                    success: false,
                    message: 'Verification request not found'
                });
                return;
            }
            if (verificationRequest.user_id !== userId) {
                res.status(403).json({
                    success: false,
                    message: 'You are not authorized to update this request'
                });
                return;
            }
            const updatedRequest = await VerificationRequest_1.VerificationRequestModel.updateStatus(id, status);
            res.status(200).json({
                success: true,
                message: 'Request status updated successfully',
                verification_request: {
                    id: updatedRequest.id,
                    status: updatedRequest.status,
                    updated_at: updatedRequest.updated_at
                }
            });
        }
        catch (error) {
            console.error('Error in updateRequestStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getVerificationRequest(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Request ID is required'
                });
                return;
            }
            const verificationRequest = await VerificationRequest_1.VerificationRequestModel.findById(id);
            if (!verificationRequest) {
                res.status(404).json({
                    success: false,
                    message: 'Verification request not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                verification_request: {
                    id: verificationRequest.id,
                    user_id: verificationRequest.user_id,
                    user_name: verificationRequest.user_name,
                    mobile_number: verificationRequest.mobile_number,
                    country_code: verificationRequest.country_code,
                    company_id: verificationRequest.company_id,
                    company_name: verificationRequest.company_name,
                    request_type: verificationRequest.request_type,
                    status: verificationRequest.status,
                    expiry_time: verificationRequest.expiry_time,
                    request_creation_date: verificationRequest.request_creation_date
                }
            });
        }
        catch (error) {
            console.error('Error in getVerificationRequest:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getCompanyRequests(req, res) {
        try {
            const { company_id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;
            if (!company_id) {
                res.status(400).json({
                    success: false,
                    message: 'Company ID is required'
                });
                return;
            }
            if (page < 1 || limit < 1 || limit > 100) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid pagination parameters'
                });
                return;
            }
            const company = await Company_1.CompanyModel.findById(company_id);
            if (!company) {
                res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
                return;
            }
            const requests = await VerificationRequest_1.VerificationRequestModel.findByCompanyId(company_id, limit, offset);
            res.status(200).json({
                success: true,
                company: {
                    id: company.id,
                    company_name: company.company_name,
                    domain: company.domain
                },
                requests: requests.map(request => ({
                    id: request.id,
                    user_id: request.user_id,
                    user_name: request.user_name,
                    mobile_number: request.mobile_number,
                    country_code: request.country_code,
                    request_type: request.request_type,
                    status: request.status,
                    expiry_time: request.expiry_time,
                    request_creation_date: request.request_creation_date
                })),
                pagination: {
                    page,
                    limit,
                    total: requests.length
                }
            });
        }
        catch (error) {
            console.error('Error in getCompanyRequests:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async markExpiredRequests(req, res) {
        try {
            const expiredCount = await VerificationRequest_1.VerificationRequestModel.markExpired();
            res.status(200).json({
                success: true,
                message: `Marked ${expiredCount} requests as expired`,
                expired_count: expiredCount
            });
        }
        catch (error) {
            console.error('Error in markExpiredRequests:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
exports.VerificationController = VerificationController;
//# sourceMappingURL=verificationController.js.map