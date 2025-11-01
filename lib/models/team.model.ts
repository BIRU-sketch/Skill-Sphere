import mongoose, { Schema, Document, Types } from 'mongoose';

interface IInvitation {
  email: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface ITeam extends Document {
  name: string;
  hackathon: Types.ObjectId;
  leader: Types.ObjectId;
  members: Types.ObjectId[];
  invitations: IInvitation[];
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>({
  email: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
});

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    hackathon: { type: Schema.Types.ObjectId, ref: 'Hackathon', required: true },
    leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    invitations: [invitationSchema],
  },
  { timestamps: true }
);

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);

