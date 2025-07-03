"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const database_1 = require("../utils/database");
const uuid_1 = require("uuid");
class CompanyModel {
    static async create(companyData) {
        const id = (0, uuid_1.v4)();
        const sql = `
      INSERT INTO companies (id, company_name, domain, intent, services_offered)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [
            id,
            companyData.company_name,
            companyData.domain,
            companyData.intent || null,
            companyData.services_offered || []
        ]);
        return result.rows[0];
    }
    static async findByDomain(domain) {
        const sql = `
      SELECT * FROM companies 
      WHERE domain = $1
    `;
        const result = await (0, database_1.query)(sql, [domain]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const sql = `
      SELECT * FROM companies 
      WHERE id = $1
    `;
        const result = await (0, database_1.query)(sql, [id]);
        return result.rows[0] || null;
    }
    static async findAll(limit = 50, offset = 0) {
        const sql = `
      SELECT * FROM companies 
      ORDER BY registration_date DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await (0, database_1.query)(sql, [limit, offset]);
        return result.rows;
    }
    static async update(id, companyData) {
        const fields = Object.keys(companyData).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = Object.values(companyData);
        const sql = `
      UPDATE companies 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [id, ...values]);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const sql = `
      DELETE FROM companies 
      WHERE id = $1
    `;
        const result = await (0, database_1.query)(sql, [id]);
        return result.rowCount > 0;
    }
}
exports.CompanyModel = CompanyModel;
//# sourceMappingURL=Company.js.map