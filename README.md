# Skill Sphere

A Next.js 14 platform that connects mentors and students through challenges. Mentors host challenges, students complete them, and earn certificates that automatically update their portfolios.

## Features

### For Mentors
- Create and manage challenges
- Review student submissions
- Approve work and issue certificates
- Track student progress

### For Students
- Browse and join challenges
- Submit completed work
- Earn certificates
- Auto-updating portfolio showcasing completed challenges

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Certificates**: jsPDF + html2canvas

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Copy your Firebase config to `.env.local`

4. Create `.env.local` file (see `.env.example`)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
skill-sphere/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── api/                 # API routes
│   └── ...
├── components/              # Reusable components
├── lib/                     # Core libraries
│   ├── firebase/           # Firebase configuration
│   └── utils/              # Utility functions
├── types/                   # TypeScript types
├── hooks/                   # Custom React hooks
└── public/                  # Static assets
```

## Database Schema

See `lib/firebase/schema.md` for detailed Firestore schema.

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT

