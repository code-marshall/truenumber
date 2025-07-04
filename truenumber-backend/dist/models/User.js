"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../utils/database");
const uuid_1 = require("uuid");
class UserModel {
    static async create(userData) {
        const uid = (0, uuid_1.v4)();
        const sql = `
      INSERT INTO users (uid, mobile_number, country_code, name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [uid, userData.mobile_number, userData.country_code, userData.name]);
        return result.rows[0];
    }
    static async findByMobileAndCountry(mobile_number, country_code) {
        const sql = `
      SELECT * FROM users 
      WHERE mobile_number = $1 AND country_code = $2
    `;
        const result = await (0, database_1.query)(sql, [mobile_number, country_code]);
        return result.rows[0] || null;
    }
    static async findById(uid) {
        const sql = `
      SELECT * FROM users 
      WHERE uid = $1
    `;
        const result = await (0, database_1.query)(sql, [uid]);
        return result.rows[0] || null;
    }
    static async update(uid, userData) {
        const fields = Object.keys(userData).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = Object.values(userData);
        const sql = `
      UPDATE users 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE uid = $1
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [uid, ...values]);
        return result.rows[0] || null;
    }
    static async delete(uid) {
        const sql = `
      DELETE FROM users 
      WHERE uid = $1
    `;
        const result = await (0, database_1.query)(sql, [uid]);
        return result.rowCount > 0;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map