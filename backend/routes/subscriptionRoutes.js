const express = require("express");
const router = express.Router();

const {
  saveSubscription,
  getSubscriptions,
  disableSubscription,
  deleteSubscription
} = require("../controllers/subscriptionController");

const auth = require("../middleware/auth");


// 🔐 protect all routes
router.use(auth);


// routes
router.post("/", saveSubscription);
router.get("/", getSubscriptions);
router.patch("/disable/:id", disableSubscription);
router.delete("/:id", deleteSubscription);


module.exports = router;
