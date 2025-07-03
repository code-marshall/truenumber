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
export declare class VerificationRequestModel {
    static create(requestData: Omit<VerificationRequest, 'id' | 'created_at' | 'updated_at' | 'request_creation_date'>): Promise<VerificationRequest>;
    static findById(id: string): Promise<VerificationRequestWithDetails | null>;
    static findByUserIdAndStatus(user_id: string, status: RequestStatus): Promise<VerificationRequest[]>;
    static findPendingByUserId(user_id: string): Promise<VerificationRequestWithDetails[]>;
    static updateStatus(id: string, status: RequestStatus): Promise<VerificationRequest | null>;
    static markExpired(): Promise<number>;
    static findByCompanyId(company_id: string, limit?: number, offset?: number): Promise<VerificationRequestWithDetails[]>;
    static delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=VerificationRequest.d.ts.map