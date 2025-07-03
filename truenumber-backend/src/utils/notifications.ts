import dotenv from 'dotenv';

dotenv.config();

export class NotificationService {
  private static slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  /**
   * Send notification to Slack
   */
  static async sendSlackNotification(message: string): Promise<boolean> {
    if (!this.slackWebhookUrl) {
      console.log('Slack webhook URL not configured');
      return false;
    }

    try {
      const response = await fetch(this.slackWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          username: 'TrueNumber Backend',
          icon_emoji: ':white_check_mark:'
        })
      });

      if (response.ok) {
        console.log('Slack notification sent successfully');
        return true;
      } else {
        console.error('Failed to send Slack notification:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      return false;
    }
  }

  /**
   * Send task completion notification
   */
  static async notifyTaskCompletion(): Promise<void> {
    const message = `🎉 *TrueNumber Backend API Development Complete!*

✅ *Features Implemented:*
• User registration with OTP verification
• JWT-based authentication
• Company registration and management
• Verification request system
• Complete API endpoints with proper validation
• PostgreSQL database with migrations
• Comprehensive test suite

🗄️ *Database Tables Created:*
• Users (mobile number, country code, name)
• Companies (name, domain, intent, services)
• Verification Requests (with status tracking)
• OTP Codes (temporary storage)

🔗 *API Endpoints Available:*
• \`POST /api/auth/send-otp\` - Send OTP
• \`POST /api/auth/verify-otp\` - Verify OTP & Register/Login
• \`GET /api/auth/profile\` - Get user profile
• \`POST /api/companies/register\` - Register company
• \`POST /api/verification/request\` - Create verification request
• \`GET /api/verification/pending\` - Get pending requests

📝 *Testing:*
• Full test coverage with Jest & Supertest
• Mocked OTP implementation (6-digit codes)
• All endpoints properly tested

🚀 *Ready to Use:*
The backend is fully functional and ready for integration with the TrueNumber mobile app!

*Location:* \`/workspace/truenumber-backend\`
*Documentation:* Check README.md for setup and usage instructions`;

    await this.sendSlackNotification(message);
  }
}