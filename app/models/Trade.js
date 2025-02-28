import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  date: { type: String, required: true },
  tradeStartTime: { type: String, required: true },
  tradeEndTime: { type: String, required: true },
  asset: { type: String, required: true },
  entry: { type: Number, required: true },
  exit: { type: Number, required: true },
  stopLoss: { type: Number, required: true },
  riskReward: { type: Number, required: true },
  profitType: { type: String, required: true },
  profitAmount: { type: Number, required: true },
  strategy: [String],
  notes: String,
  image: String,
  weeklyBias: String,
  dailyBias: String,
  type: { type: String, required: true, enum: ['realTime', 'barReplay'] },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Trade || mongoose.model('Trade', tradeSchema); 