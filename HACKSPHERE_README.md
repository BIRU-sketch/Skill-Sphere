# HackSphere - University Hackathon & CTF Platform

A comprehensive platform for universities to organize and manage coding hackathons and CTF (Capture The Flag) cybersecurity challenges.

## 🚀 Features

### Participant (Student) Features
- ✅ User registration and login using university email (.edu)
- ✅ Profile setup with name, department, skills, and GitHub link
- ✅ Browse and register for hackathons
- ✅ Create or join teams, manage team members
- ✅ Submit project details: title, description, tech stack, GitHub repo, deployment link
- ✅ Upload project files (PDF, PPT, or ZIP)
- ✅ View announcements, deadlines, and personal dashboard
- ✅ Track leaderboard and project status
- ✅ Receive judge feedback
- ✅ Download digital certificates

### Organizer / Company Features
- ✅ Create and manage hackathons (title, description, rules, timeline, category)
- ✅ Approve or remove participants and teams
- ✅ Add judges and assign them to projects
- ✅ Define judging criteria (innovation, technical implementation, design, impact, presentation)
- ✅ View and download project submissions
- ✅ Publish leaderboard and results
- ✅ Auto-generate and send digital certificates
- ✅ View analytics (participants, submissions, judge activity)
- ✅ Send announcements and updates to participants

## 📁 Project Structure

```
Skill-Sphere/
├── app/
│   ├── (hacksphere)/              # HackSphere feature routes
│   │   ├── participant/
│   │   │   ├── dashboard/         # Participant dashboard
│   │   │   ├── teams/             # Team management
│   │   │   └── submit/            # Project submission
│   │   ├── organizer/
│   │   │   ├── dashboard/         # Organizer control center
│   │   │   ├── hackathons/
│   │   │   │   └── new/           # Create hackathon
│   │   │   └── certificates/      # Certificate management
│   │   └── leaderboard/
│   │       └── [hackathonId]/    # Live leaderboard
│   └── api/                       # Next.js API routes
│       ├── auth/
│       │   ├── register/         # User registration
│       │   ├── login/             # User login
│       │   └── profile/           # Get user profile
│       ├── hackathons/
│       │   ├── route.ts           # List/Create hackathons
│       │   ├── [id]/
│       │   │   ├── route.ts       # Get/Update hackathon
│       │   │   └── announcements/ # Post announcements
│       ├── submissions/
│       │   ├── route.ts           # Submit project
│       │   └── [hackathonId]/     # List submissions
│       ├── leaderboard/
│       │   └── [hackathonId]/     # Get leaderboard
│       └── certificates/
│           └── [hackathonId]/
│               └── generate/       # Generate certificates
├── components/
│   ├── forms/
│   │   ├── HackathonForm.tsx      # Hackathon creation form
│   │   └── SubmissionForm.tsx     # Project submission form
│   ├── cards/
│   │   ├── FeatureCard.tsx        # Feature showcase card
│   │   └── StatCard.tsx          # Statistics card
│   └── dashboard/
│       ├── AnnouncementList.tsx  # Announcements component
│       ├── LeaderboardTable.tsx  # Leaderboard table
│       └── SubmissionCard.tsx    # Submission display card
├── lib/
│   ├── models/                    # Mongoose models
│   │   ├── user.model.ts         # User schema
│   │   ├── hackathon.model.ts    # Hackathon schema
│   │   ├── team.model.ts         # Team schema
│   │   └── submission.model.ts   # Submission schema
│   ├── middleware/
│   │   └── auth.ts               # JWT authentication middleware
│   ├── utils/
│   │   ├── jwt.ts                # JWT signing/verification
│   │   ├── storage.ts             # Firebase Storage uploads
│   │   └── certificates.ts       # Certificate generation
│   └── config/
│       └── db.ts                 # MongoDB connection
├── hooks/
│   └── useAuth.ts                # Authentication hook & context
└── components/
    └── WelcomePage.jsx            # Landing page
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **Backend**: Next.js API Routes (serverless)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Firebase Storage / AWS S3
- **Forms**: React Hook Form
- **Real-time**: Socket.io (TODO: implement WebSocket handler)

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file with:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/hacksphere
   # Or use MongoDB Atlas: mongodb+srv://...

   # JWT
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d

   # Firebase (for file storage)
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com

   # Existing Firebase config (from .env.local)
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   # ... other Firebase config
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Flow

1. User registers with university email (must end with `.edu`)
2. Password is hashed with bcryptjs
3. JWT token is issued upon successful registration/login
4. Token stored in localStorage (client) and sent in `Authorization: Bearer <token>` header
5. API routes verify token via `authenticate()` middleware

## 📊 Database Models

### User
- `role`: participant | organizer | judge | admin
- `email`: unique, lowercase
- `password`: hashed with bcrypt
- `profile`: { fullName, department, skills[], githubUrl, avatarUrl }
- `university`: extracted from email domain
- `verified`: boolean

### Hackathon
- `title`, `description`, `rules`
- `category`: Hackathon | CTF
- `organizer`: ObjectId reference to User
- `teams[]`: array of Team ObjectIds
- `participants[]`: array of User ObjectIds
- `judges[]`: array of User ObjectIds
- `criteria[]`: [{ key, weight }]
- `announcements[]`: [{ title, message, audience, createdAt }]
- `startDate`, `endDate`, `registrationDeadline`
- `status`: draft | published | completed

### Team
- `name`: team name
- `hackathon`: ObjectId reference to Hackathon
- `leader`: ObjectId reference to User
- `members[]`: array of User ObjectIds
- `invitations[]`: [{ email, status }]

### Submission
- `hackathon`: ObjectId reference to Hackathon
- `team`: ObjectId reference to Team
- `submittedBy`: ObjectId reference to User
- `title`, `description`
- `techStack[]`: array of strings
- `repoUrl`, `demoUrl`, `artifactUrl`
- `feedback[]`: [{ judge, comments, scores{}, totalScore }]
- `status`: draft | submitted | reviewed
- `aggregateScore`: calculated from feedback average

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Hackathons
- `GET /api/hackathons` - List published hackathons
- `POST /api/hackathons` - Create hackathon (organizer)
- `GET /api/hackathons/[id]` - Get hackathon details
- `PUT /api/hackathons/[id]` - Update hackathon (organizer)
- `POST /api/hackathons/[id]/announcements` - Post announcement (organizer)

### Submissions
- `POST /api/submissions` - Submit project (participant)
- `GET /api/submissions/[hackathonId]` - List submissions (organizer/judge)

### Leaderboard
- `GET /api/leaderboard/[hackathonId]` - Get real-time leaderboard

### Certificates
- `POST /api/certificates/[hackathonId]/generate` - Generate certificates (organizer)

## 🎨 UI Components

### Forms
- **HackathonForm**: Complete form with validation for creating hackathons
- **SubmissionForm**: Project submission with file upload support

### Dashboard Components
- **AnnouncementList**: Display announcements with real-time updates
- **LeaderboardTable**: Sortable table with rankings
- **SubmissionCard**: Display submission details with feedback

### Cards
- **FeatureCard**: Navigate to different features
- **StatCard**: Display statistics with icons

## 🔄 Real-time Features (TODO)

Socket.io integration needed for:
- Live leaderboard updates
- Real-time announcements
- Team invitation notifications
- Judge feedback notifications

## 🚀 Deployment

1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure Firebase Storage for file uploads
3. Set environment variables in deployment platform (Vercel, Railway, etc.)
4. Build and deploy:
   ```bash
   npm run build
   npm start
   ```

## 📝 Next Steps

1. Implement Socket.io WebSocket handler for real-time updates
2. Complete certificate generation with jsPDF
3. Add email notifications (using Nodemailer or SendGrid)
4. Implement judge feedback submission endpoint
5. Add team management API endpoints
6. Create theme toggle for dark/light mode
7. Add comprehensive error handling and validation

## 🤝 Contributing

This is a starter template. Feel free to expand upon it:
- Add more robust error handling
- Implement caching strategies
- Add unit and integration tests
- Enhance UI/UX with more animations
- Add analytics dashboard for organizers

## 📄 License

MIT

