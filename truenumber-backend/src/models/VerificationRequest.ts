import { query } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

export type RequestType = 'otp' | 'number_selection';
export type RequestStatus = 'user_rejected' | 'limit_exceeded' | 'user_action_pending' | 'request_sent' | 'request_displayed' | 'request_opened' | 'completed' | 'expired';

export interface VerificationRequest {
  id: string;
  user_id: string;
  company_id: string;
  request_type: RequestType;
  request_creation_date?: Date;
  status: RequestStatus;
  expiry_time: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface VerificationRequestWithDetails extends VerificationRequest {
  user_name?: string;
  mobile_number?: string;
  country_code?: string;
  company_name?: string;
  domain?: string;
  intent?: string;
}

export class VerificationRequestModel {
  static async create(requestData: Omit<VerificationRequest, 'id' | 'created_at' | 'updated_at' | 'request_creation_date'>): Promise<VerificationRequest> {
    const id = uuidv4();
    const sql = `
      INSERT INTO verification_requests (id, user_id, company_id, request_type, status, expiry_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await query(sql, [
      id,
      requestData.user_id,
      requestData.company_id,
      requestData.request_type,
      requestData.status,
      requestData.expiry_time
    ]);
    return result.rows[0];
  }

  static async findById(id: string): Promise<VerificationRequestWithDetails | null> {
    const sql = `
      SELECT vr.*, u.name as user_name, u.mobile_number, u.country_code, c.company_name
      FROM verification_requests vr
      JOIN users u ON vr.user_id = u.uid
      JOIN companies c ON vr.company_id = c.id
      WHERE vr.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  static async findByUserIdAndStatus(user_id: string, status: RequestStatus): Promise<VerificationRequest[]> {
    const sql = `
      SELECT vr.*, c.company_name
      FROM verification_requests vr
      JOIN companies c ON vr.company_id = c.id
      WHERE vr.user_id = $1 AND vr.status = $2
      ORDER BY vr.request_creation_date DESC
    `;
    const result = await query(sql, [user_id, status]);
    return result.rows;
  }

  static async findPendingByUserId(user_id: string): Promise<VerificationRequestWithDetails[]> {
    const sql = `
      SELECT vr.*, c.company_name, c.domain, c.intent
      FROM verification_requests vr
      JOIN companies c ON vr.company_id = c.id
      WHERE vr.user_id = $1 
        AND vr.status = 'user_action_pending'
        AND vr.expiry_time > CURRENT_TIMESTAMP
      ORDER BY vr.request_creation_date DESC
    `;
    const result = await query(sql, [user_id]);
    return result.rows;
  }

  static async updateStatus(id: string, status: RequestStatus): Promise<VerificationRequest | null> {
    const sql = `
      UPDATE verification_requests 
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [id, status]);
    return result.rows[0] || null;
  }

  static async markExpired(): Promise<number> {
    const sql = `
      UPDATE verification_requests 
      SET status = 'expired', updated_at = CURRENT_TIMESTAMP
      WHERE expiry_time < CURRENT_TIMESTAMP 
        AND status NOT IN ('completed', 'expired', 'user_rejected')
      RETURNING id
    `;
    const result = await query(sql);
    return result.rowCount;
  }

  static async findByCompanyId(company_id: string, limit: number = 50, offset: number = 0): Promise<VerificationRequestWithDetails[]> {
    const sql = `
      SELECT vr.*, u.name as user_name, u.mobile_number, u.country_code
      FROM verification_requests vr
      JOIN users u ON vr.user_id = u.uid
      WHERE vr.company_id = $1
      ORDER BY vr.request_creation_date DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await query(sql, [company_id, limit, offset]);
    return result.rows;
  }

  static async delete(id: string): Promise<boolean> {
    const sql = `
      DELETE FROM verification_requests 
      WHERE id = $1
    `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }
}