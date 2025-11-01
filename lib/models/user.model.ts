import mongoose, { Schema, Document } from 'mongoose';

interface IProfile {
  fullName: string;
  department?: string;
  skills?: string[];
  githubUrl?: string;
  avatarUrl?: string;
}

interface IUser extends Document {
  role: 'participant' | 'organizer' | 'judge' | 'admin';
  email: string;
  password: string;
  profile: IProfile;
  university?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  fullName: { type: String, required: true },
  department: String,
  skills: [String],
  githubUrl: String,
  avatarUrl: String,
});

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ['participant', 'organizer', 'judge', 'admin'],
      required: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    profile: profileSchema,
    university: String,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create model if it doesn't exist, otherwise use existing
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

