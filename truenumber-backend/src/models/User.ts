import { query } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  uid: string;
  mobile_number: string;
  country_code: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(userData: Omit<User, 'uid' | 'created_at' | 'updated_at'>): Promise<User> {
    const uid = uuidv4();
    const sql = `
      INSERT INTO users (uid, mobile_number, country_code, name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [uid, userData.mobile_number, userData.country_code, userData.name]);
    return result.rows[0];
  }

  static async findByMobileAndCountry(mobile_number: string, country_code: string): Promise<User | null> {
    const sql = `
      SELECT * FROM users 
      WHERE mobile_number = $1 AND country_code = $2
    `;
    const result = await query(sql, [mobile_number, country_code]);
    return result.rows[0] || null;
  }

  static async findById(uid: string): Promise<User | null> {
    const sql = `
      SELECT * FROM users 
      WHERE uid = $1
    `;
    const result = await query(sql, [uid]);
    return result.rows[0] || null;
  }

  static async update(uid: string, userData: Partial<Omit<User, 'uid' | 'created_at'>>): Promise<User | null> {
    const fields = Object.keys(userData).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = Object.values(userData);
    
    const sql = `
      UPDATE users 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE uid = $1
      RETURNING *
    `;
    const result = await query(sql, [uid, ...values]);
    return result.rows[0] || null;
  }

  static async delete(uid: string): Promise<boolean> {
    const sql = `
      DELETE FROM users 
      WHERE uid = $1
    `;
    const result = await query(sql, [uid]);
    return result.rowCount > 0;
  }
}