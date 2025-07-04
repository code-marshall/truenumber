export interface User {
    uid: string;
    mobile_number: string;
    country_code: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}
export declare class UserModel {
    static create(userData: Omit<User, 'uid' | 'created_at' | 'updated_at'>): Promise<User>;
    static findByMobileAndCountry(mobile_number: string, country_code: string): Promise<User | null>;
    static findById(uid: string): Promise<User | null>;
    static update(uid: string, userData: Partial<Omit<User, 'uid' | 'created_at'>>): Promise<User | null>;
    static delete(uid: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map