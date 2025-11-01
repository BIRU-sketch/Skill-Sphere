import mongoose, { Schema, Document, Types } from 'mongoose';

interface IAnnouncement {
  title: string;
  message: string;
  audience: 'all' | 'participants' | 'organizers';
  createdAt: Date;
}

interface ICriteria {
  key: 'innovation' | 'technicalImplementation' | 'design' | 'impact' | 'presentation';
  weight: number;
}

interface IHackathon extends Document {
  title: string;
  description: string;
  rules?: string;
  category: 'Hackathon' | 'CTF';
  organizer: Types.ObjectId;
  teams: Types.ObjectId[];
  participants: Types.ObjectId[];
  judges: Types.ObjectId[];
  criteria: ICriteria[];
  announcements: IAnnouncement[];
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  status: 'draft' | 'published' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: {
    type: String,
    enum: ['all', 'participants', 'organizers'],
    default: 'all',
  },
  createdAt: { type: Date, default: Date.now },
});

const criteriaSchema = new Schema<ICriteria>({
  key: {
    type: String,
    enum: ['innovation', 'technicalImplementation', 'design', 'impact', 'presentation'],
    required: true,
  },
  weight: { type: Number, default: 1 },
});

const hackathonSchema = new Schema<IHackathon>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rules: String,
    category: {
      type: String,
      enum: ['Hackathon', 'CTF'],
      default: 'Hackathon',
    },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    judges: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    criteria: [criteriaSchema],
    announcements: [announcementSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

export const Hackathon = mongoose.models.Hackathon || mongoose.model<IHackathon>('Hackathon', hackathonSchema);

