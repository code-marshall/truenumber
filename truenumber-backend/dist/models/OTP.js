"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPModel = void 0;
const database_1 = require("../utils/database");
const uuid_1 = require("uuid");
class OTPModel {
    static async create(otpData) {
        const id = (0, uuid_1.v4)();
        const sql = `
      INSERT INTO otp_codes (id, mobile_number, country_code, otp_code, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [
            id,
            otpData.mobile_number,
            otpData.country_code,
            otpData.otp_code,
            otpData.expires_at
        ]);
        return result.rows[0];
    }
    static async findByMobileAndCode(mobile_number, country_code, otp_code) {
        const sql = `
      SELECT * FROM otp_codes 
      WHERE mobile_number = $1 AND country_code = $2 AND otp_code = $3
        AND expires_at > CURRENT_TIMESTAMP
        AND is_verified = FALSE
      ORDER BY created_at DESC
      LIMIT 1
    `;
        const result = await (0, database_1.query)(sql, [mobile_number, country_code, otp_code]);
        return result.rows[0] || null;
    }
    static async findLatestByMobile(mobile_number, country_code) {
        const sql = `
      SELECT * FROM otp_codes 
      WHERE mobile_number = $1 AND country_code = $2
        AND expires_at > CURRENT_TIMESTAMP
      ORDER BY created_at DESC
      LIMIT 1
    `;
        const result = await (0, database_1.query)(sql, [mobile_number, country_code]);
        return result.rows[0] || null;
    }
    static async incrementAttempts(id) {
        const sql = `
      UPDATE otp_codes 
      SET attempts = attempts + 1
      WHERE id = $1
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [id]);
        return result.rows[0] || null;
    }
    static async markAsVerified(id) {
        const sql = `
      UPDATE otp_codes 
      SET is_verified = TRUE
      WHERE id = $1
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [id]);
        return result.rows[0] || null;
    }
    static async cleanupExpired() {
        const sql = `
      DELETE FROM otp_codes 
      WHERE expires_at < CURRENT_TIMESTAMP
    `;
        const result = await (0, database_1.query)(sql);
        return result.rowCount;
    }
    static async invalidateExistingOTPs(mobile_number, country_code) {
        const sql = `
      UPDATE otp_codes 
      SET is_verified = TRUE
      WHERE mobile_number = $1 AND country_code = $2 AND is_verified = FALSE
    `;
        const result = await (0, database_1.query)(sql, [mobile_number, country_code]);
        return result.rowCount;
    }
}
exports.OTPModel = OTPModel;
//# sourceMappingURL=OTP.js.map