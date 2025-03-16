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

export default {
  sendEmail,
  isEmailConfigured
}; 