import { Timestamp } from 'firebase/firestore';

export type UserRole = 'mentor' | 'student' | 'ctf-participant' | 'ctf-host' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  bio?: string;
  skills?: string[];
  expertise?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ChallengeStatus = 'active' | 'closed' | 'archived';
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  mentorName: string;
  category: string;
  difficulty: ChallengeDifficulty;
  requirements: string[];
  learningOutcomes: string[];
  resources?: Resource[];
  maxParticipants?: number;
  deadline?: Timestamp;
  status: ChallengeStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Resource {
  title: string;
  url: string;
}

export type EnrollmentStatus = 
  | 'enrolled' 
  | 'in-progress' 
  | 'submitted' 
  | 'approved' 
  | 'rejected';

export interface Enrollment {
  id: string;
  challengeId: string;
  challengeTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: EnrollmentStatus;
  applicationEssay: string;
  whyJoin: string;
  experience: string;
  enrolledAt: Timestamp;
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;
}

export type SubmissionStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'needs-revision';

export interface Submission {
  id: string;
  enrollmentId: string;
  challengeId: string;
  studentId: string;
  studentName: string;
  submissionUrl: string;
  description: string;
  fileUrls?: string[];
  status: SubmissionStatus;
  feedback?: string;
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  challengeId: string;
  challengeTitle: string;
  mentorId: string;
  mentorName: string;
  issueDate: Timestamp;
  certificateUrl: string;
  verificationCode: string;
  skills: string[];
}

export interface CompletedChallenge {
  challengeId: string;
  challengeTitle: string;
  category: string;
  completedAt: Timestamp;
  certificateId: string;
}

export interface Portfolio {
  id: string;
  studentId: string;
  studentName: string;
  bio: string;
  email: string;
  photoURL?: string;
  skills: string[];
  completedChallenges: CompletedChallenge[];
  certificateCount: number;
  totalPoints: number;
  profileUrl: string;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Form types
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ChallengeFormData {
  title: string;
  description: string;
  category: string;
  difficulty: ChallengeDifficulty;
  requirements: string[];
  learningOutcomes: string[];
  resources?: Resource[];
  maxParticipants?: number;
  deadline?: Date;
}

export interface SubmissionFormData {
  submissionUrl: string;
  description: string;
  files?: File[];
}

export interface ProfileFormData {
  displayName: string;
  bio: string;
  skills?: string[];
  expertise?: string[];
  photoURL?: string;
}

// ============================================
// CTF (Capture The Flag) Types
// ============================================

export type CTFEventStatus = 'upcoming' | 'active' | 'paused' | 'ended';
export type CTFEventType = 'public' | 'private';
export type CTFEventMode = 'online' | 'offline' | 'hybrid';
export type CTFChallengeCategory = 'web' | 'crypto' | 'forensics' | 'reverse' | 'pwn' | 'osint' | 'misc';
export type CTFDifficulty = 'easy' | 'medium' | 'hard';

export interface CTFEvent {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  type: CTFEventType;
  mode: CTFEventMode;
  status: CTFEventStatus;
  startTime: Timestamp;
  endTime: Timestamp;
  maxTeamSize: number;
  allowIndividuals: boolean;
  registrationDeadline?: Timestamp;
  totalChallenges: number;
  participantCount: number;
  teamCount: number;
  bannerUrl?: string;
  rules?: string[];
  prizes?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CTFChallenge {
  id: string;
  eventId: string;
  title: string;
  description: string;
  category: CTFChallengeCategory;
  difficulty: CTFDifficulty;
  basePoints: number;
  currentPoints: number;
  dynamicScoring: boolean;
  flagHash: string;
  hints: CTFHint[];
  attachments: CTFAttachment[];
  solveCount: number;
  maxSolves?: number;
  firstBloodBonus: number;
  tags: string[];
  author: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CTFHint {
  id: string;
  text: string;
  cost: number;
  order: number;
}

export interface CTFAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface CTFTeam {
  id: string;
  eventId: string;
  name: string;
  captainId: string;
  captainName: string;
  members: CTFTeamMember[];
  maxSize: number;
  score: number;
  lastSolveTime?: Timestamp;
  solvedChallenges: string[];
  avatar?: string;
  isPublic: boolean;
  createdAt: Timestamp;
}

export interface CTFTeamMember {
  userId: string;
  username: string;
  role: 'captain' | 'member';
  joinedAt: Timestamp;
}

export interface CTFSubmission {
  id: string;
  eventId: string;
  challengeId: string;
  userId: string;
  username: string;
  teamId?: string;
  teamName?: string;
  flag: string;
  isCorrect: boolean;
  points: number;
  submittedAt: Timestamp;
  ipAddress?: string;
}

export interface CTFParticipant {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  email: string;
  teamId?: string;
  score: number;
  solvedChallenges: string[];
  hintsUsed: string[];
  badges: CTFBadge[];
  streak: number;
  level: number;
  xp: number;
  registeredAt: Timestamp;
}

export interface CTFBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Timestamp;
}

export interface CTFLeaderboardEntry {
  rank: number;
  teamId?: string;
  teamName?: string;
  userId?: string;
  username?: string;
  score: number;
  solveCount: number;
  lastSolveTime?: Timestamp;
  badges: string[];
}

export interface CTFWriteup {
  id: string;
  eventId: string;
  challengeId: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  approved: boolean;
  likes: number;
  views: number;
  createdAt: Timestamp;
}

// CTF Form Types
export interface CTFEventFormData {
  title: string;
  description: string;
  type: CTFEventType;
  mode: CTFEventMode;
  startTime: Date;
  endTime: Date;
  maxTeamSize: number;
  allowIndividuals: boolean;
  registrationDeadline?: Date;
  rules?: string[];
  prizes?: string[];
}

export interface CTFChallengeFormData {
  title: string;
  description: string;
  category: CTFChallengeCategory;
  difficulty: CTFDifficulty;
  basePoints: number;
  dynamicScoring: boolean;
  flag: string;
  hints: { text: string; cost: number }[];
  tags: string[];
  firstBloodBonus: number;
}

export interface CTFTeamFormData {
  name: string;
  isPublic: boolean;
}

