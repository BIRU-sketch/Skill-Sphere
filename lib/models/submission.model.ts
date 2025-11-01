import mongoose, { Schema, Document, Types } from 'mongoose';

interface IFeedback {
  judge: Types.ObjectId;
  comments: string;
  scores: {
    innovation?: number;
    technicalImplementation?: number;
    design?: number;
    impact?: number;
    presentation?: number;
  };
  totalScore: number;
  createdAt: Date;
}

interface ISubmission extends Document {
  hackathon: Types.ObjectId;
  team: Types.ObjectId;
  submittedBy: Types.ObjectId;
  title: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  demoUrl?: string;
  artifactUrl?: string;
  feedback: IFeedback[];
  status: 'draft' | 'submitted' | 'reviewed';
  aggregateScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    judge: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: { type: String, required: true },
    scores: {
      innovation: Number,
      technicalImplementation: Number,
      design: Number,
      impact: Number,
      presentation: Number,
    },
    totalScore: { type: Number, required: true },
  },
  { timestamps: true }
);

const submissionSchema = new Schema<ISubmission>(
  {
    hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    repoUrl: { type: String, required: true },
    demoUrl: String,
    artifactUrl: String,
    feedback: [feedbackSchema],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'reviewed'],
      default: 'submitted',
    },
    aggregateScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Calculate aggregate score from feedback when feedback is added
submissionSchema.pre('save', function (next) {
  if (this.feedback.length > 0) {
    const avgScore = this.feedback.reduce((sum, f) => sum + f.totalScore, 0) / this.feedback.length;
    this.aggregateScore = Math.round(avgScore * 10) / 10;
  }
  next();
});

export const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', submissionSchema);

