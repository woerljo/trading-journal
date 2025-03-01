import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: String,
  weeklyProfit: Number,
  weekNumber: Number,
  year: Number,
  trades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade'
  }]
});

export default mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);