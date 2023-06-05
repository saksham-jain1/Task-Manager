const mongoose = require("mongoose");


const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique:[true, "Email already in use"] },
    password: { type: String, required: true },
    pages:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Page",
            },
        ],
  },
  {
    timestamps: false,
  }
);


const User = mongoose.model("User", userModel);

module.exports = User;
