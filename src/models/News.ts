import mongoose, { Document, Schema } from "mongoose";

export interface INews extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  images: string[];
  files: string[];
}

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    files: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const News = mongoose.model<INews>("News", newsSchema);
