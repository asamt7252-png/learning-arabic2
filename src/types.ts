export type ProgramFormat = 'individual' | 'group' | 'intensive';
export type ProgramMode = 'online' | 'offline';
export type TraineeLevel = 'beginner' | 'intermediate' | 'advanced';
export type RegistrationStatus = 'new' | 'contacted' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface ProgramTrack {
  id: string;
  title: string;
  subtitle: string;
  mode: ProgramMode;
  category: 'online' | 'offline' | 'speaking' | 'writing' | 'pronunciation' | 'non-native';
  format?: ProgramFormat;
  offlineType?: 'private-1on1' | 'small-group';
  groupSize?: number; // e.g., 5 for small group
  groupRequirementNotice?: string;
  durationWeeks: number;
  durationText: string;
  totalSessions: number;
  sessionDurationMinutes: number;
  platform: string; // e.g., 'Zoom', 'Tatap Muka (Bogor)'
  originalPriceIDR?: number;
  priceIDR: number;
  priceDisplay: string;
  originalPriceDisplay?: string;
  discountText?: string;
  level: string;
  description: string;
  features: string[];
  syllabus?: { title: string; desc: string }[];
  isPopular?: boolean;
  locationNote?: string;
}

export interface TraineeRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  programId: string;
  programTitle: string;
  mode: ProgramMode;
  format: ProgramFormat;
  offlineType?: 'private-1on1' | 'small-group';
  teamBatch?: number; // 1 or 2 for small-group offline
  currentLevel: TraineeLevel;
  goals: string;
  preferredTime: string;
  status: RegistrationStatus;
  registeredAt: string;
  coachNotes?: string;
  diagnosticScore?: number;
  paymentMethod?: string;
  senderAccountName?: string;
  paymentStatus?: 'pending' | 'verified';
  paymentAmount?: string;
  paymentDate?: string;
  paymentProofNote?: string;
  paymentProofImage?: string;
  deletedAt?: string;
  isDeleted?: boolean;
}

export interface TrainingExcerpt {
  id: string;
  title: string;
  category: string;
  textWithTashkeel: string;
  plainText: string;
  difficulty: string;
  linguisticNotes: string[];
  translationID?: string;
  audioSpeed?: number;
}

export interface CommonMistake {
  id: string;
  wrong: string;
  correct: string;
  reason: string;
  example: string;
}

export interface CoachProfile {
  name: string;
  title: string;
  bio: string;
  experienceYears: number;
  studentsCount: number;
  hoursCompleted: number;
  rating: number;
  email: string;
  whatsapp: string;
  location: string;
  credentials: string[];
}

export type UserRole = 'student' | 'instructor';

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  registeredAt?: string;
}
