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

