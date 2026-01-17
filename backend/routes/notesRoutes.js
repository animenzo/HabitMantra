const express = require('express');
const router = express.Router();

const notes = require('../controllers/notesController');


// FOLDERS
router.post("/folders", notes.createFolder);
router.get("/folders", notes.getFolders);
router.patch("/folders/:id", notes.updateFolder);
router.delete("/folders/:id", notes.deleteFolder);

// FILES
router.post("/files", notes.createFile);
router.get("/files/all", notes.getAllFiles);
router.get("/files/:folderId", notes.getFilesByFolder);
router.patch("/files/:id", notes.updateFile);
router.delete("/files/:id", notes.deleteFile);

// CARDS
router.post("/cards", notes.createCard);
router.get("/cards/all", notes.getAllCards);
router.get("/cards/:fileId", notes.getCardsByFile);
router.patch("/cards/:id", notes.updateCard);
router.delete("/cards/:id", notes.deleteCard);

// BLOCKS
router.post("/blocks", notes.createBlock);
router.get("/blocks/all", notes.getAllBlocks);
router.get("/blocks/:cardId", notes.getBlocksByCard);
router.patch("/blocks/:id", notes.updateBlock);
router.delete("/blocks/:id", notes.deleteBlock);

router.get("/search", notes.searchNotes);

module.exports = router;