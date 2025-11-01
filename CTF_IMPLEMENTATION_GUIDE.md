# CTF (Capture The Flag) Implementation Guide

## 🎯 Overview

This guide details the CTF features integrated into Skill Sphere, providing a complete cybersecurity competition platform alongside the existing mentorship system.

## ✅ Completed

### 1. Types & Constants (`types/index.ts`, `lib/constants.ts`)
- ✅ Extended UserRole to include: `ctf-participant`, `ctf-host`, `admin`
- ✅ Created CTF-specific types:
  - `CTFEvent` - Competition events
  - `CTFChallenge` - Individual challenges
  - `CTFTeam` - Team structure
  - `CTFSubmission` - Flag submissions
  - `CTFParticipant` - Participant profiles
  - `CTFLeaderboard` - Leaderboard entries
  - `CTFWriteup` - Challenge write-ups
- ✅ Added CTF constants:
  - Categories: Web, Crypto, Forensics, Reverse, Pwn, OSINT, Misc
  - Difficulty levels: Easy, Medium, Hard
  - Badges: First Blood, Crypto Master, etc.
  - Rate limiting configuration
  - Scoring system parameters

### 2. Security Utilities (`lib/utils/security.ts`)
- ✅ Flag hashing with bcrypt
- ✅ Flag verification
- ✅ Rate limiting system
- ✅ Random flag generation

### 3. Dependencies
- ✅ Added `bcryptjs` for secure flag hashing
- ✅ Added `@types/bcryptjs` for TypeScript support

## 📋 Remaining Implementation

### Step 1: Install New Dependencies

```bash
npm install
```

### Step 2: Create CTF Firebase Services

Create the following service files in `lib/firebase/`:

#### A. `lib/firebase/ctf-event-service.ts`

```typescript
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { CTFEvent, CTFEventFormData } from '@/types';

export async function createCTFEvent(
  data: CTFEventFormData,
  hostId: string,
  hostName: string
): Promise<string> {
  const eventData = {
    ...data,
    hostId,
    hostName,
    status: 'upcoming',
    startTime: Timestamp.fromDate(data.startTime),
    endTime: Timestamp.fromDate(data.endTime),
    registrationDeadline: data.registrationDeadline 
      ? Timestamp.fromDate(data.registrationDeadline) 
      : undefined,
    totalChallenges: 0,
    participantCount: 0,
    teamCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'ctf-events'), eventData);
  return docRef.id;
}

export async function getCTFEvent(eventId: string): Promise<CTFEvent | null> {
  const eventDoc = await getDoc(doc(db, 'ctf-events', eventId));
  if (!eventDoc.exists()) return null;
  return { id: eventDoc.id, ...eventDoc.data() } as CTFEvent;
}

export async function getActiveCTFEvents(): Promise<CTFEvent[]> {
  const q = query(
    collection(db, 'ctf-events'),
    where('status', 'in', ['upcoming', 'active']),
    orderBy('startTime', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CTFEvent));
}

export async function updateCTFEventStatus(
  eventId: string,
  status: CTFEvent['status']
): Promise<void> {
  await updateDoc(doc(db, 'ctf-events', eventId), {
    status,
    updatedAt: Timestamp.now(),
  });
}

// Add more functions as needed
```

#### B. `lib/firebase/ctf-challenge-service.ts`

```typescript
import { collection, doc, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { CTFChallenge, CTFChallengeFormData } from '@/types';
import { hashFlag } from '@/lib/utils/security';
import { CTF_SCORING } from '@/lib/constants';

export async function createCTFChallenge(
  eventId: string,
  data: CTFChallengeFormData,
  author: string
): Promise<string> {
  const flagHash = await hashFlag(data.flag);
  
  const challengeData = {
    eventId,
    title: data.title,
    description: data.description,
    category: data.category,
    difficulty: data.difficulty,
    basePoints: data.basePoints,
    currentPoints: data.basePoints,
    dynamicScoring: data.dynamicScoring,
    flagHash,
    hints: data.hints.map((h, i) => ({ ...h, id: `hint-${i}`, order: i })),
    attachments: [],
    solveCount: 0,
    firstBloodBonus: data.firstBloodBonus,
    tags: data.tags,
    author,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'ctf-challenges'), challengeData);
  return docRef.id;
}

export async function getCTFChallengesByEvent(eventId: string): Promise<CTFChallenge[]> {
  const q = query(
    collection(db, 'ctf-challenges'),
    where('eventId', '==', eventId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CTFChallenge));
}

export async function calculateDynamicPoints(
  challenge: CTFChallenge
): Promise<number> {
  if (!challenge.dynamicScoring) return challenge.basePoints;
  
  const decay = CTF_SCORING.DYNAMIC_DECAY_RATE;
  const minPercentage = CTF_SCORING.MIN_POINTS_PERCENTAGE;
  const solves = challenge.solveCount;
  
  const decayedPoints = challenge.basePoints * Math.pow(1 - decay, solves);
  const minPoints = challenge.basePoints * minPercentage;
  
  return Math.max(Math.round(decayedPoints), minPoints);
}

// Add more functions as needed
```

#### C. `lib/firebase/ctf-submission-service.ts`

```typescript
import { collection, doc, addDoc, updateDoc, Timestamp, increment } from 'firebase/firestore';
import { db } from './config';
import { CTFSubmission, CTFChallenge } from '@/types';
import { verifyFlag, checkRateLimit } from '@/lib/utils/security';
import { CTF_RATE_LIMITS, CTF_SCORING } from '@/lib/constants';
import { getCTFChallenge } from './ctf-challenge-service';

export async function submitCTFFlag(
  eventId: string,
  challengeId: string,
  userId: string,
  username: string,
  flag: string,
  teamId?: string,
  teamName?: string
): Promise<{ success: boolean; message: string; points?: number }> {
  // Rate limiting
  const rateLimitKey = `${userId}-${challengeId}`;
  const rateLimit = checkRateLimit(
    rateLimitKey,
    CTF_RATE_LIMITS.FLAG_SUBMISSION.maxAttempts,
    CTF_RATE_LIMITS.FLAG_SUBMISSION.windowMs
  );

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetTime! - Date.now()) / 1000)} seconds.`,
    };
  }

  // Get challenge
  const challenge = await getCTFChallenge(challengeId);
  if (!challenge) {
    return { success: false, message: 'Challenge not found' };
  }

  // Verify flag
  const isCorrect = await verifyFlag(flag, challenge.flagHash);

  // Calculate points
  const points = isCorrect ? await calculateDynamicPoints(challenge) : 0;

  // Create submission
  const submission: Omit<CTFSubmission, 'id'> = {
    eventId,
    challengeId,
    userId,
    username,
    teamId,
    teamName,
    flag: '', // Never store the actual flag
    isCorrect,
    points,
    submittedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'ctf-submissions'), submission);

  if (isCorrect) {
    // Update challenge solve count
    await updateDoc(doc(db, 'ctf-challenges', challengeId), {
      solveCount: increment(1),
    });

    // Update participant/team score
    // TODO: Implement score update logic

    return { success: true, message: 'Correct! 🎉', points };
  }

  return { success: false, message: 'Incorrect flag. Try again!' };
}

// Add more functions as needed
```

#### D. `lib/firebase/ctf-team-service.ts`

```typescript
import { collection, doc, addDoc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { CTFTeam, CTFTeamFormData, CTFTeamMember } from '@/types';

export async function createCTFTeam(
  eventId: string,
  data: CTFTeamFormData,
  captainId: string,
  captainName: string,
  maxSize: number
): Promise<string> {
  const captain: CTFTeamMember = {
    userId: captainId,
    username: captainName,
    role: 'captain',
    joinedAt: Timestamp.now(),
  };

  const teamData: Omit<CTFTeam, 'id'> = {
    eventId,
    name: data.name,
    captainId,
    captainName,
    members: [captain],
    maxSize,
    score: 0,
    solvedChallenges: [],
    isPublic: data.isPublic,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'ctf-teams'), teamData);
  return docRef.id;
}

export async function joinCTFTeam(
  teamId: string,
  userId: string,
  username: string
): Promise<{ success: boolean; message: string }> {
  const teamDoc = await getDoc(doc(db, 'ctf-teams', teamId));
  if (!teamDoc.exists()) {
    return { success: false, message: 'Team not found' };
  }

  const team = teamDoc.data() as CTFTeam;
  
  if (team.members.length >= team.maxSize) {
    return { success: false, message: 'Team is full' };
  }

  if (team.members.some(m => m.userId === userId)) {
    return { success: false, message: 'Already a member' };
  }

  const newMember: CTFTeamMember = {
    userId,
    username,
    role: 'member',
    joinedAt: Timestamp.now(),
  };

  await updateDoc(doc(db, 'ctf-teams', teamId), {
    members: arrayUnion(newMember),
  });

  return { success: true, message: 'Successfully joined team!' };
}

// Add more functions as needed
```

### Step 3: Create CTF Components

Create components in `components/ctf/`:

#### A. `components/ctf/CTFEventCard.tsx`

```typescript
import Link from 'next/link';
import { CTFEvent } from '@/types';
import { ROUTES } from '@/lib/constants';
import { formatDate, getRelativeTime } from '@/lib/utils/date';

interface CTFEventCardProps {
  event: CTFEvent;
}

export default function CTFEventCard({ event }: CTFEventCardProps) {
  return (
    <Link href={ROUTES.CTF_EVENT_DETAIL(event.id)} 
          className="block bg-gray-900 border border-cyan-500 rounded-lg p-6 hover:border-cyan-400 transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-cyan-400">{event.title}</h3>
        <EventStatusBadge status={event.status} />
      </div>
      <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Start:</span>
          <span className="text-white ml-2">{formatDate(event.startTime, 'PPp')}</span>
        </div>
        <div>
          <span className="text-gray-500">Duration:</span>
          <span className="text-white ml-2">{/* Calculate duration */}</span>
        </div>
        <div>
          <span className="text-gray-500">Participants:</span>
          <span className="text-white ml-2">{event.participantCount}</span>
        </div>
        <div>
          <span className="text-gray-500">Challenges:</span>
          <span className="text-white ml-2">{event.totalChallenges}</span>
        </div>
      </div>
    </Link>
  );
}

function EventStatusBadge({ status }: { status: CTFEvent['status'] }) {
  const colors = {
    upcoming: 'bg-blue-500',
    active: 'bg-green-500',
    paused: 'bg-yellow-500',
    ended: 'bg-gray-500',
  };
  
  return (
    <span className={`px-3 py-1 ${colors[status]} text-white text-xs rounded-full uppercase`}>
      {status}
    </span>
  );
}
```

#### B. `components/ctf/CTFChallengeList.tsx`

Shows list of challenges with categories, difficulty, and solve status.

#### C. `components/ctf/CTFLeaderboard.tsx`

Real-time leaderboard with teams/individuals ranked by score.

#### D. `components/ctf/CTFSubmitFlag.tsx`

Flag submission form with rate limiting feedback.

### Step 4: Create CTF Pages

Create pages in `app/(dashboard)/ctf/`:

#### A. `app/(dashboard)/ctf/events/page.tsx`

Browse all CTF events (upcoming, active, past).

#### B. `app/(dashboard)/ctf/events/[id]/page.tsx`

Event detail page with:
- Event information
- Challenge list
- Leaderboard
- Team management
- Registration/Join button

#### C. `app/(dashboard)/ctf/events/create/page.tsx`

Create new CTF event (for hosts/admins).

#### D. `app/(dashboard)/ctf/admin/page.tsx`

Admin dashboard for managing events, challenges, and users.

### Step 5: Update Navbar

Update `components/Navbar.tsx` to include CTF navigation:

```typescript
<Link href={ROUTES.CTF_EVENTS} className="flex items-center gap-2">
  <FiFlag className="w-5 h-5" />
  <span>CTF</span>
</Link>
```

### Step 6: Update Firestore Rules

Add to `firestore.rules`:

```javascript
// CTF Events
match /ctf-events/{eventId} {
  allow read: if true; // Public events visible to all
  allow create: if isAuthenticated() && (getUserRole() == 'ctf-host' || getUserRole() == 'admin');
  allow update: if isAuthenticated() && 
                   (resource.data.hostId == request.auth.uid || getUserRole() == 'admin');
}

// CTF Challenges
match /ctf-challenges/{challengeId} {
  allow read: if isAuthenticated();
  allow create: if isAuthenticated() && 
                   (getUserRole() == 'ctf-host' || getUserRole() == 'admin');
  allow update: if isAuthenticated() && getUserRole() == 'admin';
}

// CTF Submissions
match /ctf-submissions/{submissionId} {
  allow read: if isAuthenticated() && 
                 (resource.data.userId == request.auth.uid || getUserRole() == 'admin');
  allow create: if isAuthenticated();
}

// CTF Teams
match /ctf-teams/{teamId} {
  allow read: if true;
  allow create: if isAuthenticated();
  allow update: if isAuthenticated() && 
                   resource.data.captainId == request.auth.uid;
}
```

### Step 7: Update Register Page

Update `app/(auth)/register/page.tsx` to include CTF roles:

```typescript
<select {...register('role')}>
  <option value="student">Student</option>
  <option value="mentor">Mentor</option>
  <option value="ctf-participant">CTF Participant</option>
  <option value="ctf-host">CTF Host</option>
</select>
```

## 🎨 Dark Hacker-Themed UI

Use these Tailwind classes for CTF pages:

- Background: `bg-gray-950` or `bg-black`
- Text: `text-cyan-400`, `text-green-400` for accents
- Borders: `border-cyan-500`, `border-green-500`
- Cards: `bg-gray-900 border border-cyan-500`
- Buttons: `bg-cyan-600 hover:bg-cyan-700`
- Monospace font for code/flags: `font-mono`

## 🔒 Security Checklist

- ✅ Flags stored as bcrypt hashes only
- ✅ Rate limiting on submissions
- ⚠️ Implement IP tracking
- ⚠️ Add CSRF protection
- ⚠️ Implement submission logs
- ⚠️ Add admin audit logs

## 📊 Features Summary

### Participant Features
- ✅ View events and challenges
- ✅ Submit flags securely
- ⚠️ Real-time leaderboard
- ⚠️ Team system
- ⚠️ Hint system with point deduction
- ⚠️ Badges and achievements
- ⚠️ Write-ups upload

### Host/Admin Features
- ✅ Create events
- ✅ Add challenges
- ⚠️ Dynamic scoring
- ⚠️ Event management (start/pause/stop)
- ⚠️ Analytics dashboard
- ⚠️ Certificate generation

## 🚀 Testing

1. Create a CTF host account
2. Create a CTF event
3. Add challenges
4. Register as participant
5. Join event
6. Solve challenges
7. Check leaderboard

## 📚 Additional Resources

- [CTF Best Practices](https://ctftime.org/)
- [Dynamic Scoring Algorithms](https://docs.ctfd.io/)
- [Security Considerations](https://owasp.org/)

## 🤝 Contributing

When adding new CTF features:
1. Update types in `types/index.ts`
2. Add constants in `lib/constants.ts`
3. Create service functions
4. Build UI components
5. Update Firestore rules
6. Test thoroughly

---

**Note**: This is a comprehensive integration that maintains compatibility with existing mentorship features while adding a full CTF platform.

