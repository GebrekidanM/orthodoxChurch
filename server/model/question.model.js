const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  });
  
  const QuestionSchema = new mongoose.Schema(
    {
      text: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      isAnonymous: { type: Boolean, default: false },
      likes: { type: Number, default: 0 },
      answers: [AnswerSchema],
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Question", QuestionSchema);