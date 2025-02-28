import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  category: { type: String, required: true },
  image: String,
  date: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.models.Insight || mongoose.model('Insight', insightSchema); 