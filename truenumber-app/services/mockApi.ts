// Mock API service for TrueNumber verification
export interface InitiateVerificationRequest {
  mobileNumber: string;
  companyId: string;
  requestId: string;
}

export interface InitiateVerificationResponse {
  status: 'success' | 'error';
  message: string;
  verificationId?: string;
  deepLinkUrl?: string;
  code?: string;
}

export interface SubmitVerificationRequest {
  verificationId: string;
  userConfirmedNumber: string;
  appUserId: string;
}

export interface SubmitVerificationResponse {
  status: 'success' | 'failed';
  message: string;
  verifiedAt?: string;
  code?: string;
}

export interface VerificationStatusResponse {
  verificationId: string;
  status: 'pending' | 'verified' | 'failed' | 'expired';
  mobileNumber: string;
  verifiedAt?: string;
}

// Mock API implementation
class MockApiService {
  private verificationSessions = new Map<string, any>();

  // Simulates network delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate a random verification ID
  private generateVerificationId(): string {
    return `ver_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate a random user ID for app instance
  generateAppUserId(): string {
    return `user_${Math.random().toString(36).substr(2, 12)}`;
  }

  // POST /api/v1/verification/initiate
  async initiateVerification(request: InitiateVerificationRequest): Promise<InitiateVerificationResponse> {
    await this.delay(800); // Simulate network delay

    // Basic validation
    if (!request.mobileNumber.match(/^\+\d{10,15}$/)) {
      return {
        status: 'error',
        message: 'Invalid mobile number format',
        code: 'INVALID_NUMBER'
      };
    }

    const verificationId = this.generateVerificationId();
    
    // Store verification session
    this.verificationSessions.set(verificationId, {
      mobileNumber: request.mobileNumber,
      companyId: request.companyId,
      requestId: request.requestId,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return {
      status: 'success',
      message: 'Verification initiated',
      verificationId,
      deepLinkUrl: `truenumberapp://verify?number=${encodeURIComponent(request.mobileNumber)}&verificationId=${verificationId}`
    };
  }

  // POST /api/v1/verification/submit
  async submitVerification(request: SubmitVerificationRequest): Promise<SubmitVerificationResponse> {
    await this.delay(1200); // Simulate network delay

    const session = this.verificationSessions.get(request.verificationId);
    
    if (!session) {
      return {
        status: 'failed',
        message: 'Verification session not found or expired',
        code: 'SESSION_NOT_FOUND'
      };
    }

    // Check if the confirmed number matches the original
    if (session.mobileNumber !== request.userConfirmedNumber) {
      this.verificationSessions.set(request.verificationId, {
        ...session,
        status: 'failed'
      });
      
      return {
        status: 'failed',
        message: 'Verification failed: Number mismatch',
        code: 'NUMBER_MISMATCH'
      };
    }

    // Simulate random failures (10% chance)
    if (Math.random() < 0.1) {
      this.verificationSessions.set(request.verificationId, {
        ...session,
        status: 'failed'
      });
      
      return {
        status: 'failed',
        message: 'Verification failed: System error',
        code: 'SYSTEM_ERROR'
      };
    }

    const verifiedAt = new Date().toISOString();
    
    // Update session as verified
    this.verificationSessions.set(request.verificationId, {
      ...session,
      status: 'verified',
      verifiedAt,
      appUserId: request.appUserId
    });

    return {
      status: 'success',
      message: 'Mobile number verified successfully!',
      verifiedAt
    };
  }

  // GET /api/v1/verification/status/:verificationId
  async getVerificationStatus(verificationId: string): Promise<VerificationStatusResponse | null> {
    await this.delay(500); // Simulate network delay

    const session = this.verificationSessions.get(verificationId);
    
    if (!session) {
      return null;
    }

    return {
      verificationId,
      status: session.status,
      mobileNumber: session.mobileNumber,
      ...(session.verifiedAt && { verifiedAt: session.verifiedAt })
    };
  }

  // Helper method to simulate deep link data
  simulateDeepLink(): { mobileNumber: string; verificationId: string } {
    const mockNumbers = ['+1234567890', '+1987654321', '+1555123456', '+1800555123'];
    const randomNumber = mockNumbers[Math.floor(Math.random() * mockNumbers.length)];
    const verificationId = this.generateVerificationId();
    
    // Store a mock session for the simulated deep link
    this.verificationSessions.set(verificationId, {
      mobileNumber: randomNumber,
      companyId: 'comp_demo',
      requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return {
      mobileNumber: randomNumber,
      verificationId
    };
  }
}

export const mockApi = new MockApiService();