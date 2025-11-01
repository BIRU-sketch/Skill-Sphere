import { Timestamp } from 'firebase/firestore';

export type UserRole = 'mentor' | 'student';

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
  status: EnrollmentStatus;
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

