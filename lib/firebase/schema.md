# Firestore Database Schema

## Collections

### users
Stores user profile information for both mentors and students.

```typescript
{
  id: string;                    // User ID (same as Firebase Auth UID)
  email: string;
  displayName: string;
  role: 'mentor' | 'student';
  photoURL?: string;
  bio?: string;
  skills?: string[];             // For students
  expertise?: string[];          // For mentors
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### challenges
Stores challenges created by mentors.

```typescript
{
  id: string;                    // Auto-generated
  title: string;
  description: string;
  mentorId: string;              // Reference to users collection
  mentorName: string;
  category: string;              // e.g., 'Web Development', 'Design', 'Data Science'
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requirements: string[];
  learningOutcomes: string[];
  resources?: {
    title: string;
    url: string;
  }[];
  maxParticipants?: number;
  deadline?: Timestamp;
  status: 'active' | 'closed' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### enrollments
Tracks student enrollments in challenges.

```typescript
{
  id: string;                    // Auto-generated
  challengeId: string;           // Reference to challenges collection
  challengeTitle: string;
  studentId: string;             // Reference to users collection
  studentName: string;
  status: 'enrolled' | 'in-progress' | 'submitted' | 'approved' | 'rejected';
  enrolledAt: Timestamp;
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;
}
```

### submissions
Stores student work submissions.

```typescript
{
  id: string;                    // Auto-generated
  enrollmentId: string;          // Reference to enrollments collection
  challengeId: string;
  studentId: string;
  studentName: string;
  submissionUrl: string;         // GitHub repo, live demo, etc.
  description: string;
  fileUrls?: string[];           // Firebase Storage URLs
  status: 'pending' | 'approved' | 'rejected' | 'needs-revision';
  feedback?: string;             // From mentor
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
}
```

### certificates
Stores issued certificates.

```typescript
{
  id: string;                    // Auto-generated (certificate ID)
  studentId: string;
  studentName: string;
  challengeId: string;
  challengeTitle: string;
  mentorId: string;
  mentorName: string;
  issueDate: Timestamp;
  certificateUrl: string;        // Firebase Storage URL for PDF
  verificationCode: string;      // Unique code for verification
  skills: string[];              // Skills demonstrated
}
```

### portfolios
Auto-generated portfolios for students.

```typescript
{
  id: string;                    // Same as studentId
  studentId: string;
  studentName: string;
  bio: string;
  email: string;
  photoURL?: string;
  skills: string[];
  completedChallenges: {
    challengeId: string;
    challengeTitle: string;
    category: string;
    completedAt: Timestamp;
    certificateId: string;
  }[];
  certificateCount: number;
  totalPoints: number;           // Optional: gamification
  profileUrl: string;            // Public portfolio URL
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Indexes

### Recommended Composite Indexes

1. **challenges**: `mentorId` (Ascending) + `status` (Ascending) + `createdAt` (Descending)
2. **enrollments**: `studentId` (Ascending) + `status` (Ascending)
3. **enrollments**: `challengeId` (Ascending) + `status` (Ascending)
4. **submissions**: `challengeId` (Ascending) + `status` (Ascending)
5. **certificates**: `studentId` (Ascending) + `issueDate` (Descending)

## Security Rules

See `firestore.rules` for detailed security rules.

