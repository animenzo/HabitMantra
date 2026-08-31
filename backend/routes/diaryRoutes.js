const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const diary = require("../controllers/diaryController");

router.post("/", auth, diary.createEntry);
router.get("/", auth, diary.getEntry);
router.get("/search", auth, diary.searchEntry);
router.patch("/:id", auth, diary.updateEntry);
router.put("/:id", auth, diary.updateEntry);
router.delete("/:id", auth, diary.deleteEntry);

module.exports = router;
