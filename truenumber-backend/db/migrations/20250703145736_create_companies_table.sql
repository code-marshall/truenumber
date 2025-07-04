-- migrate:up
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    intent TEXT,
    services_offered TEXT[],
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(domain)
);

-- Create indexes for faster lookups
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_name ON companies(company_name);
CREATE INDEX idx_companies_registration_date ON companies(registration_date);

-- migrate:down
DROP INDEX IF EXISTS idx_companies_registration_date;
DROP INDEX IF EXISTS idx_companies_name;
DROP INDEX IF EXISTS idx_companies_domain;
DROP TABLE companies;

