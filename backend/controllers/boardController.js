const asyncHandler = require("express-async-handler");
const Board = require("../Modals/boardModel");
const Page = require("../Modals/pageModel");

const addBoard = asyncHandler(async (req, res) => {
  try {
    const board = new Board(req.body.board);
    const result = await board.save();
    const page = await Page.findByIdAndUpdate(
      req.body.PageId,
      { $push: { boards: board._id } },
      { new: true }
    );
    res.status(201).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

const updateBoard = asyncHandler(async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, cards: req.body.cards },
      { new: true }
    );
    res.status(201).send(board);
  } catch (error) {
    res.status(400).send(error);
  }
});


const deleteBoard = asyncHandler(async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    const Pages = await Page.findByIdAndUpdate(
      req.body.PageId,
      { $pull: { boards: req.params.id } },
      { new: true }
    );
    res.status(201).send(board);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { addBoard, updateBoard, deleteBoard };
