import mongoose, { Schema } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: { type: String },

    fileName: { type: String, required: true },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, required: true },

    score: { type: Number, required: true },

    keywords: {
      matched: [String],
      missing: [String],
    },

    sections: {
      skills: Boolean,
      education: Boolean,
      experience: Boolean,
    },

    suggestions: [String],
    feedback: [String],
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", ResumeSchema);

export default Resume;
