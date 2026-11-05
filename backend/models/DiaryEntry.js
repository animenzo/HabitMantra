const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to your User model
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Untitled Diary',
    trim: true,
  },
}, { timestamps: true });

// Performance indexes for user queries
diaryEntrySchema.index({ user: 1, updatedAt: -1 });
diaryEntrySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
