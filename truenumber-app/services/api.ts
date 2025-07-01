// Mock API service for TrueNumber app
interface User {
  id: string;
  phoneNumber: string;
  countryCode: string;
  name: string;
  token: string;
}

interface PendingValidation {
  id: string;
  companyName: string;
  options: number[];
  correctOption: number;
}

// Mock storage
let users: User[] = [];
let pendingValidations: PendingValidation[] = [];
let currentUser: User | null = null;

// Generate mock data
const generateMockValidation = (): PendingValidation => {
  const correctOption = Math.floor(Math.random() * 9000) + 1000; // 4 digit number
  const options = [correctOption];
  
  // Generate 2 more random options
  while (options.length < 3) {
    const randomOption = Math.floor(Math.random() * 9000) + 1000;
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }
  
  // Shuffle the options
  options.sort(() => Math.random() - 0.5);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    companyName: ['TechCorp', 'SecureBank', 'ShopEasy', 'PayFast'][Math.floor(Math.random() * 4)],
    options,
    correctOption
  };
};

// Add some mock pending validations periodically
setInterval(() => {
  if (currentUser && Math.random() < 0.3) { // 30% chance every 10 seconds
    pendingValidations.push(generateMockValidation());
  }
}, 10000);

export const mockApi = {
  // Send OTP to phone number
  sendOTP: async (countryCode: string, phoneNumber: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // For demo purposes, always return success
    return {
      success: true,
      message: 'OTP sent successfully'
    };
  },

  // Verify OTP
  verifyOTP: async (countryCode: string, phoneNumber: string, otp: string): Promise<{ success: boolean; token?: string; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any 6-digit OTP
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      const token = Math.random().toString(36).substr(2, 15);
      return {
        success: true,
        token,
        message: 'OTP verified successfully'
      };
    }
    
    return {
      success: false,
      message: 'Invalid OTP'
    };
  },

  // Complete user registration with name
  completeRegistration: async (token: string, name: string, countryCode: string, phoneNumber: string): Promise<{ success: boolean; user?: User; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      phoneNumber,
      countryCode,
      name,
      token
    };
    
    users.push(user);
    currentUser = user;
    
    return {
      success: true,
      user,
      message: 'Registration completed successfully'
    };
  },

  // Get pending validations
  getPendingValidations: async (token: string): Promise<{ success: boolean; validations?: PendingValidation[]; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if token is valid
    const user = users.find(u => u.token === token);
    if (!user) {
      return {
        success: false,
        message: 'Invalid token'
      };
    }
    
    return {
      success: true,
      validations: pendingValidations,
      message: 'Validations fetched successfully'
    };
  },

  // Verify selection
  verifySelection: async (token: string, validationId: string, selectedOption: number): Promise<{ success: boolean; correct?: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if token is valid
    const user = users.find(u => u.token === token);
    if (!user) {
      return {
        success: false,
        message: 'Invalid token'
      };
    }
    
    const validation = pendingValidations.find(v => v.id === validationId);
    if (!validation) {
      return {
        success: false,
        message: 'Validation not found'
      };
    }
    
    const isCorrect = selectedOption === validation.correctOption;
    
    // Remove the validation from pending list
    pendingValidations = pendingValidations.filter(v => v.id !== validationId);
    
    return {
      success: true,
      correct: isCorrect,
      message: isCorrect ? 'Correct selection! Verification completed.' : 'Incorrect selection. Verification failed.'
    };
  }
};

export type { User, PendingValidation };