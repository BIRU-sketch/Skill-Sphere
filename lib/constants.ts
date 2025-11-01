// Challenge categories
export const CHALLENGE_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps',
  'Game Development',
  'Blockchain',
] as const;

// Challenge difficulties
export const CHALLENGE_DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', color: 'green' },
  { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
  { value: 'advanced', label: 'Advanced', color: 'red' },
] as const;

// Enrollment statuses
export const ENROLLMENT_STATUSES = {
  enrolled: { label: 'Enrolled', color: 'blue' },
  'in-progress': { label: 'In Progress', color: 'yellow' },
  submitted: { label: 'Submitted', color: 'purple' },
  approved: { label: 'Approved', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
} as const;

// Submission statuses
export const SUBMISSION_STATUSES = {
  pending: { label: 'Pending Review', color: 'yellow' },
  approved: { label: 'Approved', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
  'needs-revision': { label: 'Needs Revision', color: 'orange' },
} as const;

// Skills/Technologies
export const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'HTML/CSS',
  'Tailwind CSS',
  'Firebase',
  'MongoDB',
  'PostgreSQL',
  'Docker',
  'AWS',
  'Git',
  'REST APIs',
  'GraphQL',
  'UI/UX Design',
  'Figma',
] as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MENTOR_DASHBOARD: '/dashboard/mentor',
  STUDENT_DASHBOARD: '/dashboard/student',
  CHALLENGES: '/challenges',
  CHALLENGE_DETAIL: (id: string) => `/challenges/${id}`,
  CREATE_CHALLENGE: '/challenges/create',
  MY_CHALLENGES: '/dashboard/my-challenges',
  SUBMISSIONS: '/dashboard/submissions',
  CERTIFICATES: '/dashboard/certificates',
  PORTFOLIO: (username: string) => `/portfolio/${username}`,
  PROFILE: '/profile',
  SETTINGS: '/settings',
  // CTF Routes
  CTF: '/ctf',
  CTF_EVENTS: '/ctf/events',
  CTF_EVENT_DETAIL: (id: string) => `/ctf/events/${id}`,
  CTF_CREATE_EVENT: '/ctf/events/create',
  CTF_ADMIN: '/ctf/admin',
  CTF_LEADERBOARD: (eventId: string) => `/ctf/events/${eventId}/leaderboard`,
  CTF_MY_TEAM: (eventId: string) => `/ctf/events/${eventId}/team`,
  CTF_WRITEUPS: (eventId: string) => `/ctf/events/${eventId}/writeups`,
} as const;

// Pagination
export const ITEMS_PER_PAGE = 12;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/zip',
] as const;

// ============================================
// CTF (Capture The Flag) Constants
// ============================================

// CTF Challenge Categories
export const CTF_CATEGORIES = [
  { value: 'web', label: 'Web Exploitation', icon: '🌐', color: 'blue' },
  { value: 'crypto', label: 'Cryptography', icon: '🔐', color: 'purple' },
  { value: 'forensics', label: 'Forensics', icon: '🔍', color: 'green' },
  { value: 'reverse', label: 'Reverse Engineering', icon: '⚙️', color: 'orange' },
  { value: 'pwn', label: 'Binary Exploitation', icon: '💥', color: 'red' },
  { value: 'osint', label: 'OSINT', icon: '🕵️', color: 'cyan' },
  { value: 'misc', label: 'Miscellaneous', icon: '🎯', color: 'gray' },
] as const;

// CTF Difficulty Levels
export const CTF_DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'green', points: '50-150' },
  { value: 'medium', label: 'Medium', color: 'yellow', points: '150-350' },
  { value: 'hard', label: 'Hard', color: 'red', points: '350-500' },
] as const;

// CTF Event Types
export const CTF_EVENT_TYPES = [
  { value: 'public', label: 'Public', description: 'Anyone can join' },
  { value: 'private', label: 'Private', description: 'Invitation only' },
] as const;

// CTF Event Modes
export const CTF_EVENT_MODES = [
  { value: 'online', label: 'Online', icon: '💻' },
  { value: 'offline', label: 'Offline', icon: '🏢' },
  { value: 'hybrid', label: 'Hybrid', icon: '🌐' },
] as const;

// CTF Badges
export const CTF_BADGES = {
  FIRST_BLOOD: {
    id: 'first_blood',
    name: 'First Blood',
    description: 'First to solve a challenge',
    icon: '🩸',
  },
  CRYPTO_MASTER: {
    id: 'crypto_master',
    name: 'Crypto Master',
    description: 'Solved 5 crypto challenges',
    icon: '🔐',
  },
  WEB_WARRIOR: {
    id: 'web_warrior',
    name: 'Web Warrior',
    description: 'Solved 5 web challenges',
    icon: '🌐',
  },
  FORENSICS_EXPERT: {
    id: 'forensics_expert',
    name: 'Forensics Expert',
    description: 'Solved 5 forensics challenges',
    icon: '🔍',
  },
  SPEEDRUN: {
    id: 'speedrun',
    name: 'Speedrunner',
    description: 'Solved 3 challenges in under 1 hour',
    icon: '⚡',
  },
  UNSTOPPABLE: {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: '7 day solving streak',
    icon: '🔥',
  },
} as const;

// CTF Rate Limiting
export const CTF_RATE_LIMITS = {
  FLAG_SUBMISSION: {
    maxAttempts: 5,
    windowMs: 60000, // 1 minute
  },
  TEAM_CREATION: {
    maxAttempts: 3,
    windowMs: 3600000, // 1 hour
  },
} as const;

// CTF Scoring
export const CTF_SCORING = {
  DYNAMIC_DECAY_RATE: 0.1, // 10% per solve
  MIN_POINTS_PERCENTAGE: 0.2, // Minimum 20% of base points
  XP_PER_SOLVE: 100,
  HINT_PENALTY_PERCENTAGE: 0.2, // 20% points reduction per hint
} as const;

