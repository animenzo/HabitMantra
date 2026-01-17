const Folder = require('../models/notes/Folder')
const File = require('../models/notes/File')
const Card = require('../models/notes/Card')
const Block = require('../models/notes/Block')

exports.createFolder = async (req, res) => {
  try {
    const folder = await Folder.create(req.body);
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find().sort({ order: 1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteFolder = async (req, res) => {
  try {
    await Folder.findByIdAndDelete(req.params.id);
    res.json({ message: "Folder deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//------------FIles-------------

exports.createFile = async (req, res) => {
  try {
    const file = await File.create(req.body);
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ order: 1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFilesByFolder = async (req, res) => {
  try {
    const files = await File.find({ folderId: req.params.folderId }).sort({ order: 1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateFile = async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteFile = async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//------------cards-----------------

exports.createCard = async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ order: 1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCardsByFile = async (req, res) => {
  try {
    const cards = await Card.find({ fileId: req.params.fileId }).sort({ order: 1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (title rename, reorder)
exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//-----------block

exports.createBlock = async (req, res) => {
  try {
    const block = await Block.create(req.body);
    res.status(201).json(block);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllBlocks = async (req, res) => {
  try {
    const blocks = await Block.find().sort({ order: 1 });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBlocksByCard = async (req, res) => {
  try {
    const blocks = await Block.find({ cardId: req.params.cardId }).sort({ order: 1 });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE (edit content OR reorder OR move card)
exports.updateBlock = async (req, res) => {
  try {
    const block = await Block.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    res.json(block);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteBlock = async (req, res) => {
  try {
    await Block.findByIdAndDelete(req.params.id);
    res.json({ message: "Block deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.searchNotes = async (req, res) => {
  // console.log("Search hit:", req.query.q);
  try {
    const q = req.query.q
    if(!q) return res.json([])
    const regex = new RegExp(q, 'i')

    const [folders,files,cards,blocks] = await Promise.all([
      Folder.find({ name: regex }).limit(5),
      File.find({ name: regex }).limit(5),
      Card.find({ title: regex }).limit(5),
      Block.find({ content: regex }).limit(10),
    ])

    res.json({ folders, files, cards, blocks })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}