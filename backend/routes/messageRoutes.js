import express from 'express';
import Message from '../models/Message.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Transporter is created lazily inside handlers so dotenv is guaranteed to have loaded
const createTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s+/g, ''),
  },
  tls: { rejectUnauthorized: false }
});

// @desc    Test SMTP connection
// @route   GET /api/messages/test-email
// @access  Public
router.get('/test-email', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ status: 'success', message: 'SMTP is correctly configured' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, company, budget, details } = req.body;
    
    if (!name || !email || !details) {
      return res.status(400).json({ message: 'Please provide name, email and message details' });
    }

    const message = await Message.create({
      name,
      email,
      company,
      budget,
      details
    });

    // Send notification email to admin
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `📬 New Message from ${name} — ${company || 'No Company'}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a2e; max-width: 600px; margin: auto;">
            <div style="background: linear-gradient(135deg, #6c63ff, #48bfe3); padding: 24px; border-radius: 12px 12px 0 0;">
              <h2 style="color: white; margin: 0;">📬 New Contact Message</h2>
            </div>
            <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6c63ff;">${email}</a></td></tr>
                ${company ? `<tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0;">${company}</td></tr>` : ''}
                ${budget ? `<tr><td style="padding: 8px 0; color: #666;">Budget</td><td style="padding: 8px 0; color: #27ae60; font-weight: bold;">${budget}</td></tr>` : ''}
              </table>
              <hr style="border: 0; border-top: 1px solid #ddd; margin: 16px 0;" />
              <h4 style="margin: 0 0 8px; color: #333;">Project Details:</h4>
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #ddd; white-space: pre-wrap;">${details}</div>
              <div style="margin-top: 20px; text-align: center;">
                <a href="http://localhost:8080/admin/messages/inbox" 
                   style="background: linear-gradient(135deg, #6c63ff, #48bfe3); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  View in Admin Inbox →
                </a>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`📬 Admin notification sent to: ${process.env.EMAIL_USER}`);
    } catch (emailErr) {
      console.error('Admin notification email failed:', emailErr.message);
      // Don't fail the request if email fails
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all messages (Inbox)
// @route   GET /api/messages/inbox
// @access  Private (Admin/Moderator)
router.get('/inbox', protect, authorizeRoles('admin', 'moderator'), async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get unread messages count
// @route   GET /api/messages/unread-count
// @access  Private (Admin/Moderator)
router.get('/unread-count', protect, authorizeRoles('admin', 'moderator'), async (req, res) => {
  try {
    const count = await Message.countDocuments({ status: 'unread' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all sent replies
// @route   GET /api/messages/sent
// @access  Private (Admin/Moderator)
router.get('/sent', protect, authorizeRoles('admin', 'moderator'), async (req, res) => {
  try {
    const messages = await Message.find({ 'replies.0': { $exists: true } }).sort({ updatedAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update message status
// @route   PATCH /api/messages/:id
// @access  Private (Admin/Moderator)
router.patch('/:id', protect, authorizeRoles('admin', 'moderator'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      message.status = req.body.status || message.status;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a message permanently
// @route   DELETE /api/messages/:id
// @access  Private (Admin/Moderator)
router.delete('/:id', protect, authorizeRoles('admin', 'moderator'), async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (message) {
      res.json({ message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reply to a message
// @route   POST /api/messages/:id/reply
// @access  Private (Admin/Moderator)
router.post('/:id/reply', protect, authorizeRoles('admin', 'moderator'), async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Update message in DB
    message.replies.push({
      content,
      sentBy: req.user.name,
      sentAt: new Date(),
    });
    message.status = 'read';
    await message.save();

    // Send Email (create transporter lazily so env vars are loaded)
    const transporter = createTransporter();
    console.log('📧 Sending email to:', message.email, '| From:', process.env.EMAIL_USER);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: message.email,
      subject: `Re: Your inquiry on ${process.env.SITE_NAME || 'our website'}`,
      text: content,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <p>Hello ${message.name},</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          <p>Best regards,<br>The Team</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 0.8em; color: #777;">You are receiving this because you contacted us via our website.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email reply sent successfully to: ${message.email}`);

    res.json({ message: 'Reply sent successfully', data: message });
  } catch (error) {
    console.error('Email Reply Error:', error);
    res.status(500).json({ 
      message: 'Email failed to send. Check terminal for details.',
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
