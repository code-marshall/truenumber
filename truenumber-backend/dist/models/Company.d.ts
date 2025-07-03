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
export declare class CompanyModel {
    static create(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'registration_date'>): Promise<Company>;
    static findByDomain(domain: string): Promise<Company | null>;
    static findById(id: string): Promise<Company | null>;
    static findAll(limit?: number, offset?: number): Promise<Company[]>;
    static update(id: string, companyData: Partial<Omit<Company, 'id' | 'created_at' | 'registration_date'>>): Promise<Company | null>;
    static delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=Company.d.ts.map