const mongoose = require("mongoose");

const cardModel = mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String },
    desc: { type: String },
    labels: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        color: { type: String },
      },
    ],
    tasks: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: false,
  }
);

const Card = mongoose.model("Card", cardModel);

module.exports = Card;