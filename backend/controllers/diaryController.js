const DiaryEntry = require('../models/DiaryEntry');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getEntry = async (req, res) => {
  try {
    // Assuming your auth middleware adds the user object or id to req.user
    // Adjust req.user.id if your middleware uses req.user._id
    const entries = await DiaryEntry.find({ user: req.user.id })
      .sort({ updatedAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

exports.updateEntry = async (req, res) => {
  const { content, title } = req.body;

  try {
    let entry = await DiaryEntry.findById(req.params.id);

    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    // Ensure user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updates = {};
    if (content !== undefined) updates.content = content;
    if (title !== undefined) updates.title = title || 'Untitled Diary';

    entry = await DiaryEntry.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

exports.deleteEntry = async (req, res) => {
  try {
    let entry = await DiaryEntry.findById(req.params.id);

    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    // Ensure user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await DiaryEntry.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

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
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate.setHours(0,0,0,0));
    const endOfDay = new Date(searchDate.setHours(23,59,59,999));
    query.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }

  try {
    const entries = await DiaryEntry.find(query).sort({ updatedAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
