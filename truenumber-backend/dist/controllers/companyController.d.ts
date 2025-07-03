import { Request, Response } from 'express';
export declare class CompanyController {
    static registerCompany(req: Request, res: Response): Promise<void>;
    static getCompany(req: Request, res: Response): Promise<void>;
    static getCompanyByDomain(req: Request, res: Response): Promise<void>;
    static listCompanies(req: Request, res: Response): Promise<void>;
    static updateCompany(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=companyController.d.ts.map