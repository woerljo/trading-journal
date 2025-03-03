import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Goal || mongoose.model('Goal', goalSchema); 