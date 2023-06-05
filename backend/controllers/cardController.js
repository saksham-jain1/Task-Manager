const asyncHandler = require("express-async-handler");
const Board = require("../Modals/boardModel");
const Card = require("../Modals/cardModel");

const addCard = asyncHandler(async (req, res) => {
    try {
      const card = new Card(req.body);
      const result = await card.save();
      const board = await Board.findByIdAndUpdate(
        req.body.BoardId,
        { $push: { cards: card._id } },
        { new: true }
      );
      res.status(201).send(result);
    } catch (e) { 
      res.status(400).send(e);
    }
});

const updateCard = asyncHandler(async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        date: req.body.date,
        desc: req.body.desc,
        labels: req.body.labels,
        tasks: req.body.tasks,
      },
      { new: true }
    );
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send(error);
  }
});

const deleteCard = asyncHandler(async (req, res) => {
try {
  const card = await Card.findByIdAndDelete(req.params.id);
  const board = await Board.findByIdAndUpdate(
    req.body.BoardId,
    {$pull: { cards: req.params.id }},
    { new: true }
  );
  res.status(201).send(card);
} catch (error) {
  res.status(400).send(error);
}
});


module.exports = { addCard, updateCard, deleteCard };
