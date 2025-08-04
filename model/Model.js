const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;
