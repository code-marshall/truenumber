import { Request, Response } from 'express';
export declare class AuthController {
    static sendOTP(req: Request, res: Response): Promise<void>;
    static verifyOTP(req: Request, res: Response): Promise<void>;
    static getProfile(req: any, res: Response): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map