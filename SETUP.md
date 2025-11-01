# Skill Sphere - Setup Guide

This guide will help you set up and run the Skill Sphere application locally.

## Prerequisites

- Node.js 18+ installed
- A Firebase account
- Git (optional)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable the following services:
   - **Authentication**: Enable Email/Password sign-in method
   - **Firestore Database**: Create a database in production mode
   - **Storage**: Enable Firebase Storage

### Configure Firestore

1. Go to Firestore Database in Firebase Console
2. Create the database in production mode
3. Update the security rules by copying content from `firestore.rules`

### Configure Storage

1. Go to Storage in Firebase Console
2. Update the security rules by copying content from `storage.rules`

### Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. If no web app exists, click "Add app" and choose Web
4. Copy the Firebase configuration object

## Step 3: Environment Variables

1. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

2. Fill in your Firebase configuration in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Firebase Admin SDK (Optional - for server-side operations)

If you need server-side Firebase operations:

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Add the following to `.env.local`:

```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key_here"
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Create Test Accounts

1. Go to `/register`
2. Create a mentor account
3. Create a student account
4. Test the application features

## Project Structure

```
skill-sphere/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   ├── mentor/
│   │   │   └── student/
│   │   ├── challenges/
│   │   └── portfolio/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   ├── Navbar.tsx
│   ├── ChallengeCard.tsx
│   ├── CertificateGenerator.tsx
│   └── LoadingSpinner.tsx
├── contexts/                     # React contexts
│   └── AuthContext.tsx
├── hooks/                        # Custom React hooks
│   ├── useUser.ts
│   ├── useChallenge.ts
│   ├── useEnrollment.ts
│   └── usePortfolio.ts
├── lib/                         # Core libraries
│   ├── firebase/                # Firebase configuration
│   │   ├── config.ts
│   │   ├── admin.ts
│   │   ├── auth-service.ts
│   │   ├── challenge-service.ts
│   │   ├── enrollment-service.ts
│   │   ├── submission-service.ts
│   │   ├── certificate-service.ts
│   │   ├── portfolio-service.ts
│   │   └── schema.md
│   ├── utils/                   # Utility functions
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   └── validation.ts
│   └── constants.ts
├── types/                       # TypeScript types
│   └── index.ts
├── public/                      # Static assets
├── firestore.rules             # Firestore security rules
├── storage.rules               # Storage security rules
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Key Features

### For Mentors
- Create and manage challenges
- Review student submissions
- Approve work and issue certificates
- Track student progress

### For Students
- Browse and join challenges
- Submit completed work
- Earn certificates
- Auto-updating portfolio

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Deploy Firebase Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

## Troubleshooting

### Authentication Issues
- Make sure Email/Password is enabled in Firebase Authentication
- Check that your environment variables are correctly set
- Clear browser cache and cookies

### Firestore Permission Errors
- Ensure Firestore rules are deployed correctly
- Check that the user is properly authenticated
- Verify the user role is set correctly

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Need Help?

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the code comments in the project files

## License

MIT

