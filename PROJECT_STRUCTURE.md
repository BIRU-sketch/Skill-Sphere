# Skill Sphere - Project Structure

This document provides an overview of the project structure and organization.

## Directory Structure

```
skill-sphere/
├── app/                                    # Next.js 14 App Router
│   ├── (auth)/                            # Authentication group (no navbar)
│   │   ├── login/
│   │   │   └── page.tsx                   # Login page
│   │   └── register/
│   │       └── page.tsx                   # Registration page
│   ├── (dashboard)/                       # Dashboard group (with navbar)
│   │   ├── layout.tsx                     # Dashboard layout with auth protection
│   │   ├── challenges/
│   │   │   ├── page.tsx                   # Browse all challenges
│   │   │   ├── create/
│   │   │   │   └── page.tsx              # Create new challenge (mentor only)
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Challenge detail page
│   │   ├── dashboard/
│   │   │   ├── mentor/
│   │   │   │   └── page.tsx              # Mentor dashboard
│   │   │   ├── student/
│   │   │   │   └── page.tsx              # Student dashboard
│   │   │   ├── certificates/
│   │   │   │   └── page.tsx              # Student certificates page
│   │   │   └── profile/
│   │   │       └── page.tsx              # Edit profile page
│   │   └── portfolio/
│   │       └── [id]/
│   │           └── page.tsx              # Public portfolio page
│   ├── globals.css                        # Global styles
│   ├── layout.tsx                         # Root layout
│   └── page.tsx                           # Landing page
│
├── components/                            # Reusable components
│   ├── Navbar.tsx                        # Navigation bar
│   ├── ChallengeCard.tsx                 # Challenge display card
│   ├── CertificateGenerator.tsx          # Certificate PDF generator
│   └── LoadingSpinner.tsx                # Loading indicator
│
├── contexts/                             # React contexts
│   └── AuthContext.tsx                   # Authentication context
│
├── hooks/                                # Custom React hooks
│   ├── useUser.ts                        # User data and auth state
│   ├── useChallenge.ts                   # Challenge data fetching
│   ├── useEnrollment.ts                  # Enrollment management
│   └── usePortfolio.ts                   # Portfolio data fetching
│
├── lib/                                  # Core libraries
│   ├── firebase/                         # Firebase services
│   │   ├── config.ts                     # Firebase client config
│   │   ├── admin.ts                      # Firebase admin config
│   │   ├── auth-service.ts              # Authentication functions
│   │   ├── challenge-service.ts         # Challenge CRUD operations
│   │   ├── enrollment-service.ts        # Enrollment management
│   │   ├── submission-service.ts        # Submission handling
│   │   ├── certificate-service.ts       # Certificate generation
│   │   ├── portfolio-service.ts         # Portfolio management
│   │   └── schema.md                    # Firestore schema documentation
│   ├── utils/                           # Utility functions
│   │   ├── cn.ts                        # Class name merger
│   │   ├── date.ts                      # Date formatting utilities
│   │   └── validation.ts                # Zod validation schemas
│   └── constants.ts                     # App-wide constants
│
├── types/                               # TypeScript definitions
│   └── index.ts                         # All type definitions
│
├── public/                              # Static assets
│   └── README.md                        # Public assets documentation
│
├── firestore.rules                      # Firestore security rules
├── storage.rules                        # Firebase Storage rules
├── middleware.ts                        # Next.js middleware
├── next.config.js                       # Next.js configuration
├── tailwind.config.js                   # Tailwind CSS configuration
├── postcss.config.js                    # PostCSS configuration
├── tsconfig.json                        # TypeScript configuration
├── package.json                         # Dependencies and scripts
├── .gitignore                           # Git ignore rules
├── .eslintrc.json                       # ESLint configuration
├── README.md                            # Project overview
├── SETUP.md                             # Setup instructions
├── CONTRIBUTING.md                      # Contribution guidelines
└── PROJECT_STRUCTURE.md                 # This file
```

## Key Concepts

### Route Groups

Next.js 14 uses route groups (folders in parentheses) to organize routes without affecting the URL structure:

- `(auth)` - Authentication pages without navbar
- `(dashboard)` - Protected pages with navbar

### Server vs Client Components

- **Server Components** (default): Used for static content and data fetching
- **Client Components** ('use client'): Used for interactivity, hooks, and browser APIs

### Firebase Services

Each service file handles a specific domain:
- `auth-service.ts` - User authentication
- `challenge-service.ts` - Challenge management
- `enrollment-service.ts` - Student enrollments
- `submission-service.ts` - Work submissions
- `certificate-service.ts` - Certificate generation
- `portfolio-service.ts` - Portfolio updates

### Type Safety

All data models are defined in `types/index.ts` and used throughout the application for type safety.

### State Management

- **Authentication**: Context API (`AuthContext`)
- **Data Fetching**: Custom hooks with local state
- **Form State**: React Hook Form

### Styling

- **Framework**: Tailwind CSS
- **Global Styles**: `app/globals.css`
- **Component Styles**: Inline Tailwind classes
- **Theme**: Configured in `tailwind.config.js`

## Data Flow

1. **Authentication**
   - User signs in → Firebase Auth
   - Auth state → AuthContext
   - Protected routes check auth status

2. **Challenge Creation** (Mentor)
   - Fill form → Validation (Zod)
   - Submit → challenge-service
   - Save to Firestore → Redirect to detail

3. **Enrollment** (Student)
   - Browse challenges → View detail
   - Enroll → enrollment-service
   - Create enrollment document in Firestore

4. **Submission & Certificate**
   - Submit work → submission-service
   - Mentor reviews → Approve/Reject
   - If approved → Generate certificate
   - Certificate saved → Portfolio auto-updates

5. **Portfolio**
   - Certificate issued → portfolio-service
   - Add to completedChallenges
   - Update skills and stats
   - Public URL accessible

## Security

- **Firestore Rules**: Define read/write permissions
- **Storage Rules**: Protect file uploads
- **Middleware**: Can add auth checks for routes
- **Environment Variables**: Store sensitive config

## Best Practices

1. **Components**: Keep them small and reusable
2. **Services**: One responsibility per service
3. **Hooks**: Extract reusable logic
4. **Types**: Define types for all data structures
5. **Error Handling**: Use try-catch and display user-friendly messages
6. **Loading States**: Show spinners during async operations
7. **Validation**: Validate all user inputs
8. **Security**: Never expose sensitive data client-side

## Future Enhancements

Potential areas for expansion:
- Real-time notifications
- Direct messaging between mentors and students
- Challenge templates
- Leaderboards and gamification
- Team challenges
- Video submissions
- AI-powered feedback
- Mobile app (React Native)

## Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

