import request from 'supertest';
import app from '../src/index';

describe('Authentication Endpoints', () => {
  const testUser = {
    mobile_number: '9876543210',
    country_code: '+91',
    name: 'Test User'
  };

  describe('POST /api/auth/send-otp', () => {
    it('should send OTP successfully with valid mobile number', async () => {
      const response = await request(app)
        .post('/api/auth/send-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP sent successfully');
      
      // In development mode, OTP should be returned
      if (process.env.NODE_ENV === 'development') {
        expect(response.body.otp).toBeDefined();
        expect(response.body.otp).toMatch(/^\d{6}$/);
      }
    });

    it('should fail with missing mobile number', async () => {
      const response = await request(app)
        .post('/api/auth/send-otp')
        .send({
          country_code: testUser.country_code
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Mobile number and country code are required');
    });

    it('should fail with invalid mobile number format', async () => {
      const response = await request(app)
        .post('/api/auth/send-otp')
        .send({
          mobile_number: '123', // Too short
          country_code: testUser.country_code
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid mobile number format');
    });

    it('should fail with invalid country code format', async () => {
      const response = await request(app)
        .post('/api/auth/send-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid country code format');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    let sentOTP: string;

    beforeEach(async () => {
      // Send OTP first
      const otpResponse = await request(app)
        .post('/api/auth/send-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code
        });
      
      sentOTP = otpResponse.body.otp || '123456'; // Use returned OTP or default for testing
    });

    it('should verify OTP and register new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code,
          otp_code: sentOTP,
          name: testUser.name
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP verified successfully');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.mobile_number).toBe(testUser.mobile_number);
      expect(response.body.user.country_code).toBe(testUser.country_code);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.token).toBeDefined();
    });

    it('should verify OTP and login existing user successfully', async () => {
      // First, register the user
      await request(app)
        .post('/api/auth/verify-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code,
          otp_code: sentOTP,
          name: testUser.name
        });

      // Send OTP again for the same user
      const otpResponse = await request(app)
        .post('/api/auth/send-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code
        });

      const newOTP = otpResponse.body.otp || '123456';

      // Login with new OTP (no name required)
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code,
          otp_code: newOTP
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.token).toBeDefined();
    });

    it('should fail with invalid OTP', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code,
          otp_code: '000000', // Invalid OTP
          name: testUser.name
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid OTP code');
    });

    it('should fail when name is missing for new user', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          mobile_number: '9876543299', // Different number for new user
          country_code: testUser.country_code,
          otp_code: sentOTP
          // Missing name
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Name is required for new user registration');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken: string;

    beforeEach(async () => {
      // Register and get token
      const otpResponse = await request(app)
        .post('/api/auth/send-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code
        });

      const verifyResponse = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          mobile_number: testUser.mobile_number,
          country_code: testUser.country_code,
          otp_code: otpResponse.body.otp || '123456',
          name: testUser.name
        });

      authToken = verifyResponse.body.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.mobile_number).toBe(testUser.mobile_number);
      expect(response.body.user.name).toBe(testUser.name);
    });

    it('should fail without authentication token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired token');
    });
  });
});