import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMonitoredTrait {
  name: string;
  notes: string;
}

export interface IUserDocument extends Document {
  name: string;
  avatar: string;
  houseId: string;
  movedIn: Date;
  currentStreak: number;
  totalJournals: number;
  chores: string[];
  traits: IMonitoredTrait[];
  createdAt: Date;
}

const MonitoredTraitSchema = new Schema<IMonitoredTrait>(
  {
    name: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: '👤' },
    houseId: { type: String, required: true },
    movedIn: { type: Date, required: true },
    currentStreak: { type: Number, default: 0 },
    totalJournals: { type: Number, default: 0 },
    chores: { type: [String], default: [] },
    traits: { type: [MonitoredTraitSchema], default: [] },
  },
  { timestamps: true }
);

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
