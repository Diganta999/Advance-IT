import express from 'express';
import Project from '../models/Project.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new project
router.post('/', protect, authorizeRoles('admin', 'moderator'), async (req, res) => {
  const { name, cat, tag, grad, h, img } = req.body;

  try {
    const newProject = new Project({ name, cat, tag, grad, h, img });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
