const mongoose = require('mongoose');
const DiaryEntry = require('../models/DiaryEntry');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getEntry = async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ user: req.user.id })
      .sort({ updatedAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error('getEntry error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createEntry = async (req, res) => {
  try {
    const newEntry = new DiaryEntry({
      user: req.user.id,
      title: req.body.title || 'Untitled Diary',
      content: req.body.content || '',
    });
    const entry = await newEntry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error('createEntry error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateEntry = async (req, res) => {
  const { id } = req.params;
  const { content, title } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid entry ID' });
  }

  try {
    const entry = await DiaryEntry.findById(id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Ensure user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updates = {};
    if (content !== undefined) updates.content = content;
    if (title !== undefined) updates.title = title || 'Untitled Diary';

    const updatedEntry = await DiaryEntry.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    res.json(updatedEntry);
  } catch (err) {
    console.error('updateEntry error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteEntry = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid entry ID' });
  }

  try {
    const entry = await DiaryEntry.findById(id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Ensure user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await DiaryEntry.findByIdAndDelete(id);

    res.json({ message: 'Entry removed' });
  } catch (err) {
    console.error('deleteEntry error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.searchEntry = async (req, res) => {
  const { keyword, date } = req.query;
  let query = { user: req.user.id };

  if (keyword && keyword.trim()) {
    const safeKeyword = escapeRegex(keyword.trim());
    query.$or = [
      { title: { $regex: safeKeyword, $options: 'i' } },
      { content: { $regex: safeKeyword, $options: 'i' } },
    ];
  }

  if (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(date)) {
      const [year, month, day] = date.split('-').map(Number);
      const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    } else {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }
    }
  }

  try {
    const entries = await DiaryEntry.find(query).sort({ updatedAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error('searchEntry error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
