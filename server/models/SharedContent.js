const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const sharedContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must not exceed 200 characters"],
    },
    type: {
      type: String,
      enum: ["interview", "aptitude"],
      required: [true, "Content type is required"],
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "Entry-level", "Experienced", "All"],
      default: "All",
    },
    questionText: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      maxlength: [4000, "Question text must not exceed 4000 characters"],
    },
    // Aptitude-specific fields
    options: {
      type: [optionSchema],
      default: [],
    },
    correctOptionId: {
      type: String,
      default: "",
    },
    explanation: {
      type: String,
      default: "",
      maxlength: [2000, "Explanation must not exceed 2000 characters"],
    },
    // Interview-specific fields
    suggestedPoints: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for bounded list filtering
sharedContentSchema.index({ type: 1, isArchived: 1, category: 1 });
sharedContentSchema.index({ isArchived: 1, createdAt: -1 });

module.exports = mongoose.model("SharedContent", sharedContentSchema);
