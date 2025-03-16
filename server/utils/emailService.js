import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Check if email credentials are properly configured
const isEmailConfigured = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  return user && pass && 
         user !== 'your-email@gmail.com' && 
         pass !== 'your-app-password';
};

// Create a transporter object if credentials are available
const createTransporter = () => {
  if (!isEmailConfigured()) {
    console.warn('Email not configured. Using console logging instead.');
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 * @returns {Promise} - Nodemailer send mail promise
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // If email is not configured, log to console instead
    if (!transporter) {
      console.log('Email would be sent (DEV MODE):');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${html.substring(0, 100)}...`);
      return { response: 'Email logged to console (not sent)' };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send a password reset email with code
 * @param {string} to - Recipient email
 * @param {string} resetCode - Password reset code
 * @returns {Promise} - Nodemailer send mail promise
 */
export const sendPasswordResetEmail = async (to, resetCode) => {
  const subject = 'Password Reset Code - Your E-commerce Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #1976d2; text-align: center;">Password Reset</h2>
      <p>You requested a password reset for your e-commerce account. Please use the following code to reset your password:</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${resetCode}
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #757575; text-align: center;">
        &copy; ${new Date().getFullYear()} Your E-commerce Store. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail(to, subject, html);
};

export default {
  sendEmail,
  sendPasswordResetEmail,
  isEmailConfigured
}; 