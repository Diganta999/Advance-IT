import express from 'express';
import Content from '../models/Content.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

const DEFAULT_CONTENT = {
  hero: {
    badge: 'Now booking Q3 engagements',
    title: 'Software that feels like the future.',
    description: "We're a senior engineering studio designing and building category-defining web, mobile, cloud and AI products for ambitious teams.",
    ctaPrimary: 'Start a project',
    ctaSecondary: 'See our work',
  },
  services: [
    { icon: 'Code2', title: 'Web Development', description: 'Lightning-fast, type-safe Next.js & TanStack apps engineered to scale.' },
    { icon: 'Smartphone', title: 'Mobile Apps', description: 'Cross-platform iOS & Android experiences with native performance.' },
    { icon: 'Palette', title: 'UI / UX Design', description: 'Design systems and product flows that convert and delight.' },
    { icon: 'Cloud', title: 'Cloud & DevOps', description: 'Resilient cloud infra on AWS, GCP and Cloudflare with full observability.' },
    { icon: 'Cpu', title: 'AI Solutions', description: 'Custom LLM agents, RAG pipelines and ML systems shipped to production.' },
    { icon: 'Shield', title: 'Cyber Security', description: 'Pen-tests, SOC 2 readiness and zero-trust architectures.' },
  ],
  team: [
    { name: 'Anya Volkov', role: 'Co-founder · CEO', imageUrl: '/team/anya.png' },
    { name: 'Marco Reyes', role: 'Co-founder · CTO', imageUrl: '/team/marco.png' },
    { name: 'Lena Park', role: 'Head of Design', imageUrl: '/team/lena.png' },
    { name: 'Idris Khan', role: 'Head of Engineering', imageUrl: '/team/idris.png' },
  ],
  stats: [
    { value: '240+', label: 'Products shipped' },
    { value: '98%', label: 'Client retention' },
    { value: '42', label: 'Engineers worldwide' },
    { value: '12', label: 'Industry awards' },
  ],
};

// @desc    Get content
// @route   GET /api/content
// @access  Public
router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = await Content.create(DEFAULT_CONTENT);
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update content
// @route   PUT /api/content
// @access  Private (Admin)
router.put('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    let content = await Content.findOne();
    const updateData = req.body;

    if (!content) {
      content = new Content(updateData);
    } else {
      // Update sections manually to avoid _id conflicts
      if (updateData.hero) content.hero = updateData.hero;
      if (updateData.services) content.services = updateData.services;
      if (updateData.team) content.team = updateData.team;
      if (updateData.stats) content.stats = updateData.stats;
    }

    const savedContent = await content.save();
    res.json(savedContent);
  } catch (error) {
    console.error('Content update error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a service
// @route   DELETE /api/content/service/:index
// @access  Private (Admin)
router.delete('/service/:index', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { index } = req.params;
    const content = await Content.findOne();

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const serviceIndex = parseInt(index);
    if (isNaN(serviceIndex) || serviceIndex < 0) {
      return res.status(400).json({ message: 'Invalid service index' });
    }

    if (serviceIndex < content.services.length) {
      content.services.splice(serviceIndex, 1);
      await content.save();
    }
    
    res.json(content);
  } catch (error) {
    console.error('Delete service error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a team member
// @route   DELETE /api/content/team/:index
// @access  Private (Admin)
router.delete('/team/:index', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { index } = req.params;
    const content = await Content.findOne();

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const teamIndex = parseInt(index);
    if (isNaN(teamIndex) || teamIndex < 0) {
      return res.status(400).json({ message: 'Invalid team index' });
    }

    if (teamIndex < content.team.length) {
      content.team.splice(teamIndex, 1);
      await content.save();
    }
    
    res.json(content);
  } catch (error) {
    console.error('Delete team error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a stat
// @route   DELETE /api/content/stat/:index
// @access  Private (Admin)
router.delete('/stat/:index', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { index } = req.params;
    const content = await Content.findOne();

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const statIndex = parseInt(index);
    if (isNaN(statIndex) || statIndex < 0) {
      return res.status(400).json({ message: 'Invalid stat index' });
    }

    if (statIndex < content.stats.length) {
      content.stats.splice(statIndex, 1);
      await content.save();
    }
    
    res.json(content);
  } catch (error) {
    console.error('Delete stat error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
