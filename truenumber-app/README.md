# TrueNumber App

A React Native mobile application that provides secure phone number verification without sharing actual phone numbers with companies.

## Features

### 1. User Registration Flow
- **Country Selection**: Choose your country from a dropdown list
- **Phone Number Input**: Enter your phone number with automatic country code
- **OTP Verification**: Receive and enter a 6-digit verification code
- **Name Entry**: Complete registration by providing your name

### 2. Home Screen
- **Dashboard**: View your verification status and user information
- **Automatic Checking**: Checks for pending verification requests every 10 seconds
- **Pull to Refresh**: Manual refresh for immediate updates
- **Logout**: Secure logout functionality

### 3. Verification Screen
- **3-Number Selection**: Choose the correct number from 3 options shown by companies
- **Company Information**: See which company is requesting verification
- **Security Note**: Confirmation that your actual number is never shared

## How to Run

1. **Install Dependencies**:
   ```bash
   cd truenumber-app
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   # or
   expo start
   ```

3. **Run on Device/Simulator**:
   - For iOS: Press `i` or run `npm run ios`
   - For Android: Press `a` or run `npm run android`
   - For Web: Press `w` or run `npm run web`

## Testing the App

### Registration Flow
1. Open the app and tap "Get Started"
2. Select any country and enter a phone number (minimum 8 digits)
3. Tap "Send OTP" and enter any 6-digit number as OTP (e.g., 123456)
4. Enter your name and complete registration

### Verification Flow
1. After registration, you'll be taken to the home screen
2. Wait for mock verification requests to appear (they generate randomly every 10 seconds with 30% probability)
3. Tap on a pending verification to open the verification screen
4. Select one of the 3 numbers shown (the correct one is randomly determined)
5. Tap "Verify" to complete the process

## Mock API Features

The app includes a complete mock API service that simulates:

- **OTP Generation**: Always accepts any 6-digit OTP for demo purposes
- **Token Management**: Creates and validates authentication tokens
- **Pending Validations**: Automatically generates mock verification requests
- **Company Simulation**: Shows requests from different mock companies (TechCorp, SecureBank, ShopEasy, PayFast)

## App Flow

```
Welcome Screen → Registration → OTP → Name Entry → Home Screen → Verification
      ↓              ↓         ↓         ↓           ↓            ↓
  Get Started    Enter Phone  Enter OTP  Enter Name  View Pending  Select Number
                                                     Requests      & Verify
```

## Technical Implementation

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context (AuthContext)
- **UI Components**: Custom styled components
- **Type Safety**: Full TypeScript implementation
- **Mock Data**: Simulated API responses with realistic delays

## Security Features

- Token-based authentication
- Secure session management
- No actual phone number sharing with companies
- User consent for all verification requests

## File Structure

```
truenumber-app/
├── app/
│   ├── _layout.tsx          # Root navigation layout
│   ├── index.tsx            # Welcome/landing screen
│   ├── register.tsx         # Phone number registration
│   ├── otp.tsx              # OTP verification
│   ├── name.tsx             # Name entry
│   ├── home.tsx             # Main dashboard
│   └── verify.tsx           # Number verification
├── contexts/
│   └── AuthContext.tsx      # Authentication state management
├── services/
│   └── api.ts               # Mock API service
└── package.json
```

## Notes for Testing

- The app automatically generates mock verification requests every 10 seconds with a 30% probability
- All API calls include realistic delays to simulate network requests
- The OTP verification accepts any 6-digit numeric input
- Verification success/failure is determined by whether you select the correct number from the 3 options

The app provides a complete demonstration of the TrueNumber verification flow and is ready for further development or integration with real backend services.
