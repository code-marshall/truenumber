import { Router } from 'express';
import { CompanyController } from '../controllers/companyController';

const router = Router();

/**
 * @route POST /api/companies/register
 * @desc Register a new company
 * @access Public
 */
router.post('/register', CompanyController.registerCompany);

/**
 * @route GET /api/companies
 * @desc List all companies (with pagination)
 * @access Public
 */
router.get('/', CompanyController.listCompanies);

/**
 * @route GET /api/companies/:id
 * @desc Get company by ID
 * @access Public
 */
router.get('/:id', CompanyController.getCompany);

/**
 * @route GET /api/companies/domain/:domain
 * @desc Get company by domain
 * @access Public
 */
router.get('/domain/:domain', CompanyController.getCompanyByDomain);

/**
 * @route PUT /api/companies/:id
 * @desc Update company information
 * @access Public (should be restricted to company owners in production)
 */
router.put('/:id', CompanyController.updateCompany);

export default router;