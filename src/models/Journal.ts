import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJournalDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  date: string;
  conversationId: string;
  durationSecs: number;
  transcript: {
    role: 'user' | 'agent';
    text: string;
    timestamp: number;
  }[];
  insights: {
    mood: {
      score: number;
      label: string;
      description: string;
    };
    summary: string;
    themes: string[];
    wins: string[];
    struggles: string[];
    people_mentioned: string[];
    looking_forward_to: string | null;
    concern_level: string;
    conversation_quality: {
      openness: number;
      duration_feel: string;
      engagement: string;
    };
  };
  createdAt: Date;
}

const TranscriptEntrySchema = new Schema(
  {
    role: { type: String, enum: ['user', 'agent'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Number, required: true },
  },
  { _id: false }
);

const MoodSchema = new Schema(
  {
    score: { type: Number, required: true, min: 1, max: 10 },
    label: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ConversationQualitySchema = new Schema(
  {
    openness: { type: Number, min: 1, max: 5 },
    duration_feel: { type: String, enum: ['brief', 'moderate', 'extended'] },
    engagement: { type: String, enum: ['minimal', 'moderate', 'high'] },
  },
  { _id: false }
);

const InsightsSchema = new Schema(
  {
    mood: { type: MoodSchema, required: true },
    summary: { type: String, required: true },
    themes: [String],
    wins: [String],
    struggles: [String],
    people_mentioned: [String],
    looking_forward_to: { type: String, default: null },
    concern_level: {
      type: String,
      enum: ['none', 'mild', 'moderate', 'high'],
      default: 'none',
    },
    conversation_quality: { type: ConversationQualitySchema },
  },
  { _id: false }
);

const JournalSchema = new Schema<IJournalDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    date: { type: String, required: true },
    conversationId: { type: String, default: '' },
    durationSecs: { type: Number, default: 0 },
    transcript: [TranscriptEntrySchema],
    insights: { type: InsightsSchema, required: true },
  },
  { timestamps: true }
);

JournalSchema.index({ userId: 1, date: -1 });

const Journal: Model<IJournalDocument> =
  mongoose.models.Journal ||
  mongoose.model<IJournalDocument>('Journal', JournalSchema);

export default Journal;
