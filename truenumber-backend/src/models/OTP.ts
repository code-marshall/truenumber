import { query } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export interface OTPCode {
  id: string;
  mobile_number: string;
  country_code: string;
  otp_code: string;
  created_at?: Date;
  expires_at: Date;
  is_verified: boolean;
  attempts: number;
  max_attempts: number;
}

export class OTPModel {
  static async create(otpData: Omit<OTPCode, 'id' | 'created_at' | 'is_verified' | 'attempts' | 'max_attempts'>): Promise<OTPCode> {
    const id = uuidv4();
    const sql = `
      INSERT INTO otp_codes (id, mobile_number, country_code, otp_code, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(sql, [
      id,
      otpData.mobile_number,
      otpData.country_code,
      otpData.otp_code,
      otpData.expires_at
    ]);
    return result.rows[0];
  }

  static async findByMobileAndCode(mobile_number: string, country_code: string, otp_code: string): Promise<OTPCode | null> {
    const sql = `
      SELECT * FROM otp_codes 
      WHERE mobile_number = $1 AND country_code = $2 AND otp_code = $3
        AND expires_at > CURRENT_TIMESTAMP
        AND is_verified = FALSE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const result = await query(sql, [mobile_number, country_code, otp_code]);
    return result.rows[0] || null;
  }

  static async findLatestByMobile(mobile_number: string, country_code: string): Promise<OTPCode | null> {
    const sql = `
      SELECT * FROM otp_codes 
      WHERE mobile_number = $1 AND country_code = $2
        AND expires_at > CURRENT_TIMESTAMP
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const result = await query(sql, [mobile_number, country_code]);
    return result.rows[0] || null;
  }

  static async incrementAttempts(id: string): Promise<OTPCode | null> {
    const sql = `
      UPDATE otp_codes 
      SET attempts = attempts + 1
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  static async markAsVerified(id: string): Promise<OTPCode | null> {
    const sql = `
      UPDATE otp_codes 
      SET is_verified = TRUE
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  static async cleanupExpired(): Promise<number> {
    const sql = `
      DELETE FROM otp_codes 
      WHERE expires_at < CURRENT_TIMESTAMP
    `;
    const result = await query(sql);
    return result.rowCount;
  }

  static async invalidateExistingOTPs(mobile_number: string, country_code: string): Promise<number> {
    const sql = `
      UPDATE otp_codes 
      SET is_verified = TRUE
      WHERE mobile_number = $1 AND country_code = $2 AND is_verified = FALSE
    `;
    const result = await query(sql, [mobile_number, country_code]);
    return result.rowCount;
  }
}