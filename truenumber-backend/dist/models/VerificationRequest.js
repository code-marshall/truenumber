"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationRequestModel = void 0;
const database_1 = require("../utils/database");
const uuid_1 = require("uuid");
class VerificationRequestModel {
    static async create(requestData) {
        const id = (0, uuid_1.v4)();
        const sql = `
      INSERT INTO verification_requests (id, user_id, company_id, request_type, status, expiry_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [
            id,
            requestData.user_id,
            requestData.company_id,
            requestData.request_type,
            requestData.status,
            requestData.expiry_time
        ]);
        return result.rows[0];
    }
    static async findById(id) {
        const sql = `
      SELECT vr.*, u.name as user_name, u.mobile_number, u.country_code, c.company_name
      FROM verification_requests vr
      JOIN users u ON vr.user_id = u.uid
      JOIN companies c ON vr.company_id = c.id
      WHERE vr.id = $1
    `;
        const result = await (0, database_1.query)(sql, [id]);
        return result.rows[0] || null;
    }
    static async findByUserIdAndStatus(user_id, status) {
        const sql = `
      SELECT vr.*, c.company_name
      FROM verification_requests vr
      JOIN companies c ON vr.company_id = c.id
      WHERE vr.user_id = $1 AND vr.status = $2
      ORDER BY vr.request_creation_date DESC
    `;
        const result = await (0, database_1.query)(sql, [user_id, status]);
        return result.rows;
    }
    static async findPendingByUserId(user_id) {
        const sql = `
      SELECT vr.*, c.company_name, c.domain, c.intent
      FROM verification_requests vr
      JOIN companies c ON vr.company_id = c.id
      WHERE vr.user_id = $1 
        AND vr.status = 'user_action_pending'
        AND vr.expiry_time > CURRENT_TIMESTAMP
      ORDER BY vr.request_creation_date DESC
    `;
        const result = await (0, database_1.query)(sql, [user_id]);
        return result.rows;
    }
    static async updateStatus(id, status) {
        const sql = `
      UPDATE verification_requests 
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [id, status]);
        return result.rows[0] || null;
    }
    static async markExpired() {
        const sql = `
      UPDATE verification_requests 
      SET status = 'expired', updated_at = CURRENT_TIMESTAMP
      WHERE expiry_time < CURRENT_TIMESTAMP 
        AND status NOT IN ('completed', 'expired', 'user_rejected')
      RETURNING id
    `;
        const result = await (0, database_1.query)(sql);
        return result.rowCount;
    }
    static async findByCompanyId(company_id, limit = 50, offset = 0) {
        const sql = `
      SELECT vr.*, u.name as user_name, u.mobile_number, u.country_code
      FROM verification_requests vr
      JOIN users u ON vr.user_id = u.uid
      WHERE vr.company_id = $1
      ORDER BY vr.request_creation_date DESC
      LIMIT $2 OFFSET $3
    `;
        const result = await (0, database_1.query)(sql, [company_id, limit, offset]);
        return result.rows;
    }
    static async delete(id) {
        const sql = `
      DELETE FROM verification_requests 
      WHERE id = $1
    `;
        const result = await (0, database_1.query)(sql, [id]);
        return result.rowCount > 0;
    }
}
exports.VerificationRequestModel = VerificationRequestModel;
//# sourceMappingURL=VerificationRequest.js.map