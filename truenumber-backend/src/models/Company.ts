import { query } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export interface Company {
  id: string;
  company_name: string;
  domain: string;
  intent?: string;
  services_offered?: string[];
  registration_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class CompanyModel {
  static async create(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'registration_date'>): Promise<Company> {
    const id = uuidv4();
    const sql = `
      INSERT INTO companies (id, company_name, domain, intent, services_offered)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(sql, [
      id, 
      companyData.company_name, 
      companyData.domain, 
      companyData.intent || null,
      companyData.services_offered || []
    ]);
    return result.rows[0];
  }

  static async findByDomain(domain: string): Promise<Company | null> {
    const sql = `
      SELECT * FROM companies 
      WHERE domain = $1
    `;
    const result = await query(sql, [domain]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<Company | null> {
    const sql = `
      SELECT * FROM companies 
      WHERE id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  static async findAll(limit: number = 50, offset: number = 0): Promise<Company[]> {
    const sql = `
      SELECT * FROM companies 
      ORDER BY registration_date DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await query(sql, [limit, offset]);
    return result.rows;
  }

  static async update(id: string, companyData: Partial<Omit<Company, 'id' | 'created_at' | 'registration_date'>>): Promise<Company | null> {
    const fields = Object.keys(companyData).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = Object.values(companyData);
    
    const sql = `
      UPDATE companies 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [id, ...values]);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const sql = `
      DELETE FROM companies 
      WHERE id = $1
    `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }
}