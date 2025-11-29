const mongoose = require("mongoose")

const FlashcardSchema = new mongoose.Schema({
  question: String,
  answer: String
});

const MCQSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correct_answer: String
});

const PerformanceSchema = new mongoose.Schema({
  total_questions: { type: Number, default: 0 },
  correct_answers: { type: Number, default: 0 },
  topic_depth_score: { type: Number, default: 0 },
  completed: { type: Number, default: false }
});

const TopicSchema = new mongoose.Schema({
  topic_name: String,
  day_no: { type: Number, default: 0 },
  summary: {
    text: String,
    key_formulas: [String]
  },
  flashcards: [FlashcardSchema],
  mcqs: [MCQSchema],
  analytical_questions: [String],
  real_world_examples: [String],
  quiz: [MCQSchema],
  performance: PerformanceSchema,
  last_updated: { type: Date, default: Date.now }
});

const SubjectSchema = new mongoose.Schema({
  subject_name: String,
  exam_date: Date,
  study_hours_per_day: Number,
  total_days: Number,
  created_at: { type: Date, default: Date.now },
  topics: [TopicSchema],
  progress_summary: {
    total_topics: Number,
    completed_topics: Number,
    average_depth_score: Number,
    growth_trend: [
      { day: Number, avg_score: Number, date: { type: Date, default: Date.now }}
    ],
    last_updated: { type: Date, default: Date.now }
  }
});

const Subject =  mongoose.model("Subject", SubjectSchema);
module.exports = Subject;