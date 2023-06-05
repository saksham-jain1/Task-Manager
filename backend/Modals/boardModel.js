const mongoose = require("mongoose");

const boardModel = mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
  },
  {
    timestamps: false,
  }
);

const Board = mongoose.model("Board", boardModel);

module.exports = Board;
