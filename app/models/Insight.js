import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
  category: [{ type: String, required: true }],
  image: { type: String },
  type: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Insight || mongoose.model('Insight', insightSchema); 