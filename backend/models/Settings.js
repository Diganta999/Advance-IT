import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'NebulaLabs' },
  siteDescription: { type: String, default: 'Premium IT & Software Engineering Studio' },
  contactEmail: { type: String, default: 'contact@nebulalabs.com' },
  maintenanceMode: { type: Boolean, default: false },
  socialLinks: {
    twitter: String,
    github: String,
    linkedin: String,
    instagram: String,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  }
}, {
  timestamps: true,
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
