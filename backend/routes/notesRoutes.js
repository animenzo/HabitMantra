const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const notes = require("../controllers/notesController");

/* FOLDERS */
router.post("/folders", auth, notes.createFolder);
router.get("/folders", auth, notes.getFolders);
router.patch("/folders/:id", auth, notes.updateFolder);
router.delete("/folders/:id", auth, notes.deleteFolder);

/* FILES */
router.post("/files", auth, notes.createFile);
router.get("/files/all", auth, notes.getAllFiles);
router.get("/files/:folderId", auth, notes.getFilesByFolder);
router.patch("/files/:id", auth, notes.updateFile);
router.delete("/files/:id", auth, notes.deleteFile);

/* CARDS */
router.post("/cards", auth, notes.createCard);
router.get("/cards/all", auth, notes.getAllCards);
router.get("/cards/:fileId", auth, notes.getCardsByFile);
router.patch("/cards/:id", auth, notes.updateCard);
router.delete("/cards/:id", auth, notes.deleteCard);

/* BLOCKS */
router.post("/blocks", auth, notes.createBlock);
router.get("/blocks/all", auth, notes.getAllBlocks);
router.get("/blocks/:cardId", auth, notes.getBlocksByCard);
router.patch("/blocks/:id", auth, notes.updateBlock);
router.delete("/blocks/:id", auth, notes.deleteBlock);

/* SEARCH */
router.get("/search", auth, notes.searchNotes);

module.exports = router;
