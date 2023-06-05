const express = require("express");
const {
  addBoard,
  updateBoard,
  deleteBoard,
  updateBoardCards,
} = require("../controllers/boardController");

const router = express.Router();
router.route("/").post(addBoard);
router.patch("/:id", updateBoard);
router.delete("/:id", deleteBoard);
module.exports = router;
