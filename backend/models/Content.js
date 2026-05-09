import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  hero: {
    badge: { type: String, default: 'Now booking Q3 engagements' },
    title: { type: String, default: 'Software that feels like the future.' },
    description: { type: String, default: "We're a senior engineering studio designing and building category-defining web, mobile, cloud and AI products for ambitious teams." },
    ctaPrimary: { type: String, default: 'Start a project' },
    ctaSecondary: { type: String, default: 'See our work' },
  },
  services: [{
    icon: { type: String, default: 'Code2' },
    title: String,
    description: String,
  }],
  team: [{
    name: String,
    role: String,
    imageUrl: String,
  }],
  testimonials: [{
    quote: String,
    name: String,
    role: String,
  }],
  stats: [{
    value: String,
    label: String,
  }],
}, {
  timestamps: true,
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
