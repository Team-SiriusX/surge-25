// Test script to verify email configuration
// Run this with: node --loader tsx test-email.ts

import { sendEmail, getPasswordResetEmailHtml } from "./src/lib/email";

async function testEmailConfiguration() {
  console.log("🧪 Testing Email Configuration...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing");
  console.log("RESEND_EMAIL:", process.env.RESEND_EMAIL || "❌ Missing");
  console.log();

  // Test email
  const testEmail = "test@example.com"; // Replace with your email for testing
  const testUrl = "http://localhost:3000/auth/reset-password?token=test-token-123";
  const testUserName = "Test User";

  try {
    console.log("📧 Attempting to send test email...");
    console.log("To:", testEmail);
    console.log("URL:", testUrl);
    console.log();

    const result = await sendEmail({
      to: testEmail,
      subject: "Test Password Reset Email",
      html: getPasswordResetEmailHtml(testUrl, testUserName),
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", result.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:");
    console.error(error);
  }
}

// Run the test
testEmailConfiguration();
