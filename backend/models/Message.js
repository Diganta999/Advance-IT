import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  budget: String,
  details: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread' },
  replies: [{
    content: String,
    sentAt: { type: Date, default: Date.now },
    sentBy: String
  }]
}, {
  timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
