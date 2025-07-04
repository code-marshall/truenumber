import { Request, Response } from 'express';
import { CompanyModel } from '../models/Company';

export class CompanyController {
  /**
   * Register a new company
   */
  static async registerCompany(req: Request, res: Response): Promise<void> {
    try {
      const { company_name, domain, intent, services_offered } = req.body;

      // Validate input
      if (!company_name || !domain) {
        res.status(400).json({
          success: false,
          message: 'Company name and domain are required'
        });
        return;
      }

      // Validate domain format
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!domainRegex.test(domain)) {
        res.status(400).json({
          success: false,
          message: 'Invalid domain format'
        });
        return;
      }

      // Check if company with domain already exists
      const existingCompany = await CompanyModel.findByDomain(domain);
      if (existingCompany) {
        res.status(409).json({
          success: false,
          message: 'Company with this domain already exists'
        });
        return;
      }

      // Create company
      const company = await CompanyModel.create({
        company_name: company_name.trim(),
        domain: domain.toLowerCase().trim(),
        intent: intent?.trim(),
        services_offered: Array.isArray(services_offered) ? services_offered.map(s => s.trim()) : []
      });

      res.status(201).json({
        success: true,
        message: 'Company registered successfully',
        company: {
          id: company.id,
          company_name: company.company_name,
          domain: company.domain,
          intent: company.intent,
          services_offered: company.services_offered,
          registration_date: company.registration_date
        }
      });

    } catch (error) {
      console.error('Error in registerCompany:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get company by ID
   */
  static async getCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Company ID is required'
        });
        return;
      }

      const company = await CompanyModel.findById(id);
      
      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        company: {
          id: company.id,
          company_name: company.company_name,
          domain: company.domain,
          intent: company.intent,
          services_offered: company.services_offered,
          registration_date: company.registration_date
        }
      });

    } catch (error) {
      console.error('Error in getCompany:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get company by domain
   */
  static async getCompanyByDomain(req: Request, res: Response): Promise<void> {
    try {
      const { domain } = req.params;

      if (!domain) {
        res.status(400).json({
          success: false,
          message: 'Domain is required'
        });
        return;
      }

      const company = await CompanyModel.findByDomain(domain.toLowerCase());
      
      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        company: {
          id: company.id,
          company_name: company.company_name,
          domain: company.domain,
          intent: company.intent,
          services_offered: company.services_offered,
          registration_date: company.registration_date
        }
      });

    } catch (error) {
      console.error('Error in getCompanyByDomain:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * List all companies (with pagination)
   */
  static async listCompanies(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = (page - 1) * limit;

      // Validate pagination params
      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters'
        });
        return;
      }

      const companies = await CompanyModel.findAll(limit, offset);

      res.status(200).json({
        success: true,
        companies: companies.map(company => ({
          id: company.id,
          company_name: company.company_name,
          domain: company.domain,
          intent: company.intent,
          services_offered: company.services_offered,
          registration_date: company.registration_date
        })),
        pagination: {
          page,
          limit,
          total: companies.length
        }
      });

    } catch (error) {
      console.error('Error in listCompanies:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update company information
   */
  static async updateCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { company_name, intent, services_offered } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Company ID is required'
        });
        return;
      }

      // Check if company exists
      const existingCompany = await CompanyModel.findById(id);
      if (!existingCompany) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      // Prepare update data
      const updateData: any = {};
      if (company_name) updateData.company_name = company_name.trim();
      if (intent !== undefined) updateData.intent = intent?.trim();
      if (services_offered !== undefined) {
        updateData.services_offered = Array.isArray(services_offered) 
          ? services_offered.map(s => s.trim()) 
          : [];
      }

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        });
        return;
      }

      const updatedCompany = await CompanyModel.update(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        company: {
          id: updatedCompany!.id,
          company_name: updatedCompany!.company_name,
          domain: updatedCompany!.domain,
          intent: updatedCompany!.intent,
          services_offered: updatedCompany!.services_offered,
          registration_date: updatedCompany!.registration_date
        }
      });

    } catch (error) {
      console.error('Error in updateCompany:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}