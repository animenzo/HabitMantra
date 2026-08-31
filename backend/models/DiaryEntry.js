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

// Enable text search
diaryEntrySchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
