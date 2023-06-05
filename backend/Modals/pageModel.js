const mongoose = require("mongoose");

const pageModel = mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    bg: {
      type: String,
      default: 'url("https://source.unsplash.com/1200x900/?office")',
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    permission: { type: String, default: "selected" },
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
    logs: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        time: { type: String },
      },
    ],
  },
  {
    timestamps: false,
  }
);

const Page = mongoose.model("Page", pageModel);

module.exports = Page;
