import mongoose, {
  HydratedDocument,
  InferSchemaType,
  model,
  Schema,
} from "mongoose";

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
    aiResult: {
      atsScore: { type: Number },
      overallScore: { type: Number },
      sectionAnalysis: {
        skills: {
          present: { type: Boolean },
          comments: { type: String },
        },
        education: {
          present: { type: Boolean },
          comments: { type: String },
        },
        experience: {
          present: { type: Boolean },
          comments: { type: String },
        },
      },
      keywordAnalysis: {
        matched: [String],
        missing: [String],
      },
      suggestions: [String],
      summary: { type: String },
      raw: { type: Schema.Types.Mixed },
    },
    compareHash: { type: String, index: true },
    lastComparedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

ResumeSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const ResumeModel = mongoose.model("Resume", ResumeSchema);

export type IResume = HydratedDocument<InferSchemaType<typeof ResumeSchema>>;

export default ResumeModel;
