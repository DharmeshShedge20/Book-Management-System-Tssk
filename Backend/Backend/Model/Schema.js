import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{13}$/, "ISBN must be exactly 13 digits"]
    },
    publishedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    }
  },
  {timestamps: true,}
);

export const Book = mongoose.model("Book", BookSchema);
 
