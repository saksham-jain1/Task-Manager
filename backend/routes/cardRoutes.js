const express = require("express");
const {
  addCard,
  updateCard,
  deleteCard,
} = require("../controllers/cardController");

const router = express.Router();
router.route("/").post(addCard);
router.patch("/:id", updateCard);
router.delete("/:id", deleteCard);
module.exports = router;
