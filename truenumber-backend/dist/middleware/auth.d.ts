import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../services/authService';
export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map