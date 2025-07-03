-- migrate:up
CREATE TYPE request_type_enum AS ENUM ('otp', 'number_selection');
CREATE TYPE request_status_enum AS ENUM ('user_rejected', 'limit_exceeded', 'user_action_pending', 'request_sent', 'request_displayed', 'request_opened', 'completed', 'expired');

CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    request_type request_type_enum NOT NULL DEFAULT 'otp',
    request_creation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status request_status_enum NOT NULL DEFAULT 'user_action_pending',
    expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_company_id ON verification_requests(company_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_verification_requests_expiry_time ON verification_requests(expiry_time);
CREATE INDEX idx_verification_requests_creation_date ON verification_requests(request_creation_date);

-- migrate:down
DROP INDEX IF EXISTS idx_verification_requests_creation_date;
DROP INDEX IF EXISTS idx_verification_requests_expiry_time;
DROP INDEX IF EXISTS idx_verification_requests_status;
DROP INDEX IF EXISTS idx_verification_requests_company_id;
DROP INDEX IF EXISTS idx_verification_requests_user_id;
DROP TABLE verification_requests;
DROP TYPE request_status_enum;
DROP TYPE request_type_enum;

