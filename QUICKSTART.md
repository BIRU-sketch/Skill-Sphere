# 🚀 Skill Sphere - Quick Start Guide

Get up and running with Skill Sphere in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env.local` file in the root directory with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Firebase

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard

#### Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"

#### Create Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose your location

#### Deploy Security Rules
Copy the content from `firestore.rules` and paste it in:
- Firestore Database → Rules tab

Copy the content from `storage.rules` and paste it in:
- Storage → Rules tab

#### Enable Storage
1. Go to Storage
2. Click "Get started"
3. Use the default settings

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 Test the Application

### Create Test Accounts

1. **Register as a Mentor**
   - Go to `/register`
   - Fill in details
   - Select "Mentor" role
   - Submit

2. **Register as a Student**
   - Open incognito/private window
   - Go to `/register`
   - Fill in details
   - Select "Student" role
   - Submit

### Test Mentor Flow

1. **Login as Mentor**
   - Go to `/login`
   - Enter mentor credentials

2. **Create a Challenge**
   - Go to "Dashboard"
   - Click "Create Challenge"
   - Fill in challenge details:
     * Title: "Build a Todo App"
     * Description: "Create a fully functional todo application"
     * Category: "Web Development"
     * Difficulty: "Beginner"
     * Add requirements and learning outcomes
   - Submit

3. **View Your Challenges**
   - Your challenge appears on the dashboard
   - Click to view details

### Test Student Flow

1. **Login as Student** (in different browser/incognito)
   - Go to `/login`
   - Enter student credentials

2. **Browse Challenges**
   - Go to "Challenges"
   - See available challenges
   - Use filters to search

3. **Enroll in Challenge**
   - Click on a challenge
   - Read details
   - Click "Enroll in Challenge"

4. **View Your Enrollments**
   - Go to "Dashboard"
   - See active enrollments

5. **Check Portfolio**
   - Go to "My Portfolio" (once you have certificates)
   - View your auto-updating portfolio

## 📁 Project Structure Overview

```
skill-sphere/
├── app/                    # Pages and routes
│   ├── (auth)/            # Login & Register
│   ├── (dashboard)/       # Protected pages
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/
│   ├── firebase/         # Firebase services
│   └── utils/            # Helper functions
├── hooks/                # Custom React hooks
├── contexts/             # React contexts
└── types/                # TypeScript types
```

## 🔥 Key Features

### For Mentors
- ✅ Create challenges
- ✅ Manage challenge status
- ✅ Review submissions
- ✅ Issue certificates

### For Students
- ✅ Browse challenges
- ✅ Enroll in challenges
- ✅ Submit work
- ✅ Earn certificates
- ✅ Auto-updating portfolio
- ✅ Public portfolio URL

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build       # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## 📚 Documentation

- **Full Setup**: See [SETUP.md](./SETUP.md)
- **Project Structure**: See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Database Schema**: See [lib/firebase/schema.md](./lib/firebase/schema.md)

## 🐛 Troubleshooting

### Firebase Connection Issues
```bash
# Check environment variables
echo $NEXT_PUBLIC_FIREBASE_API_KEY
```

### Build Errors
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run dev
```

### Authentication Not Working
1. Verify Email/Password is enabled in Firebase Console
2. Check `.env.local` has correct Firebase config
3. Clear browser cache and cookies

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: { /* your colors */ },
  secondary: { /* your colors */ },
}
```

### Add New Features
1. Create service in `lib/firebase/`
2. Create hook in `hooks/`
3. Create page in `app/`
4. Update types in `types/index.ts`

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Deploy Firebase Rules
```bash
firebase login
firebase init
firebase deploy --only firestore:rules,storage
```

## 💡 Tips

- Use separate Firebase projects for dev/production
- Test with both mentor and student accounts
- Check browser console for errors
- Read the code comments for understanding

## 🤝 Need Help?

- Read the full [SETUP.md](./SETUP.md) guide
- Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- Review code examples in the files
- Check Firebase and Next.js documentation

## ✨ What's Next?

After basic setup, you can:
1. Implement submission review system
2. Add real-time notifications
3. Create messaging between mentors/students
4. Add file upload for submissions
5. Implement certificate verification page
6. Add analytics and tracking
7. Create mobile app version

Happy coding! 🎉

