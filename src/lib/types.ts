export interface TranscriptMessage {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export interface Mood {
  score: number; // 1-10
  label: 'struggling' | 'low' | 'mixed' | 'okay' | 'good' | 'great' | 'excellent';
  description: string;
}

export interface ConversationQuality {
  openness: number; // 1-5
  duration_feel: 'brief' | 'moderate' | 'extended';
  engagement: 'minimal' | 'moderate' | 'high';
}

export interface Insights {
  mood: Mood;
  summary: string;
  themes: string[];
  wins: string[];
  struggles: string[];
  people_mentioned: string[];
  looking_forward_to: string | null;
  concern_level: 'none' | 'mild' | 'moderate' | 'high';
  conversation_quality: ConversationQuality;
}

export interface IJournal {
  _id: string;
  userId: string;
  userName: string;
  date: string;
  conversationId: string;
  durationSecs: number;
  transcript: TranscriptMessage[];
  insights: Insights;
  createdAt: string;
}

export interface MonitoredTrait {
  name: string;
  notes: string;
}

export interface IUser {
  _id: string;
  name: string;
  avatar: string;
  houseId: string;
  movedIn: string;
  currentStreak: number;
  totalJournals: number;
  chores: string[];
  traits: MonitoredTrait[];
  createdAt: string;
}

export interface DashboardData {
  user: IUser;
  moodTrend: { date: string; score: number; label: string }[];
  recentEntries: IJournal[];
  topThemes: { theme: string; count: number }[];
  recentWins: string[];
  totalEntries: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function getMoodEmoji(score: number): string {
  if (score >= 9) return '🤩';
  if (score >= 7) return '😊';
  if (score >= 5) return '😐';
  if (score >= 3) return '😔';
  return '😢';
}

export function getMoodColor(score: number): string {
  if (score >= 8) return 'text-emerald-500';
  if (score >= 6) return 'text-teal-500';
  if (score >= 4) return 'text-amber-500';
  if (score >= 2) return 'text-orange-500';
  return 'text-rose-400';
}

export function getMoodBgColor(score: number): string {
  if (score >= 8) return 'bg-emerald-50 border-emerald-200';
  if (score >= 6) return 'bg-teal-50 border-teal-200';
  if (score >= 4) return 'bg-amber-50 border-amber-200';
  if (score >= 2) return 'bg-orange-50 border-orange-200';
  return 'bg-rose-50 border-rose-200';
}
