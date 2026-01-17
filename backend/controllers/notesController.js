const Folder = require("../models/notes/Folder");
const File = require("../models/notes/File");
const Card = require("../models/notes/Card");
const Block = require("../models/notes/Block");

/* ===================== FOLDERS ===================== */

// CREATE
exports.createFolder = async (req, res) => {
  try {
    const folder = await Folder.create({
      name: req.body.name,
      order: req.body.order ?? 0,
      user: req.user.id,
    });
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ
exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id }).sort({ order: 1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({ message: "Folder deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================== FILES ===================== */

exports.createFile = async (req, res) => {
  try {
    const file = await File.create({
      folderId: req.body.folderId,
      name: req.body.name,
      order: req.body.order ?? 0,
      user: req.user.id,
    });
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ order: 1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFilesByFolder = async (req, res) => {
  try {
    const files = await File.find({
      folderId: req.params.folderId,
      user: req.user.id,
    }).sort({ order: 1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================== CARDS ===================== */

exports.createCard = async (req, res) => {
  try {
    const card = await Card.create({
      fileId: req.body.fileId,
      title: req.body.title,
      order: req.body.order ?? 0,
      user: req.user.id,
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user.id }).sort({ order: 1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCardsByFile = async (req, res) => {
  try {
    const cards = await Card.find({
      fileId: req.params.fileId,
      user: req.user.id,
    }).sort({ order: 1 });

    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================== BLOCKS ===================== */

exports.createBlock = async (req, res) => {
  try {
    const block = await Block.create({
      cardId: req.body.cardId,
      content: req.body.content,
      order: req.body.order ?? 0,
      user: req.user.id,
    });
    res.status(201).json(block);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBlocks = async (req, res) => {
  try {
    const blocks = await Block.find({ user: req.user.id }).sort({ order: 1 });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBlocksByCard = async (req, res) => {
  try {
    const blocks = await Block.find({
      cardId: req.params.cardId,
      user: req.user.id,
    }).sort({ order: 1 });

    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBlock = async (req, res) => {
  try {
    const block = await Block.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!block) {
      return res.status(404).json({ message: "Block not found" });
    }

    res.json(block);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlock = async (req, res) => {
  try {
    const block = await Block.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!block) {
      return res.status(404).json({ message: "Block not found" });
    }

    res.json({ message: "Block deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================== SEARCH ===================== */

exports.searchNotes = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ folders: [], files: [], cards: [], blocks: [] });

    const regex = new RegExp(q, "i");

    const [folders, files, cards, blocks] = await Promise.all([
      Folder.find({ name: regex, user: req.user.id }).limit(5),
      File.find({ name: regex, user: req.user.id }).limit(5),
      Card.find({ title: regex, user: req.user.id }).limit(5),
      Block.find({ content: regex, user: req.user.id }).limit(10),
    ]);

    res.json({ folders, files, cards, blocks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
