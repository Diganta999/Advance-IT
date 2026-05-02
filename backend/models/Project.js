import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cat: { type: String, required: true },
  tag: { type: String, required: true },
  grad: { type: String, required: true },
  h: { type: String, required: true },
  img: { type: String, required: true },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
