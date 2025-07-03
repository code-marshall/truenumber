import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class VerificationController {
    static createVerificationRequest(req: Request, res: Response): Promise<void>;
    static getPendingRequests(req: AuthenticatedRequest, res: Response): Promise<void>;
    static updateRequestStatus(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getVerificationRequest(req: Request, res: Response): Promise<void>;
    static getCompanyRequests(req: Request, res: Response): Promise<void>;
    static markExpiredRequests(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=verificationController.d.ts.map