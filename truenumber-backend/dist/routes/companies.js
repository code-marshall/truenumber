"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controllers/companyController");
const router = (0, express_1.Router)();
router.post('/register', companyController_1.CompanyController.registerCompany);
router.get('/', companyController_1.CompanyController.listCompanies);
router.get('/:id', companyController_1.CompanyController.getCompany);
router.get('/domain/:domain', companyController_1.CompanyController.getCompanyByDomain);
router.put('/:id', companyController_1.CompanyController.updateCompany);
exports.default = router;
//# sourceMappingURL=companies.js.map