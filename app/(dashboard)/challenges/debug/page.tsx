'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function DebugChallengesPage() {
  const { user, firebaseUser, loading: userLoading } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const info: any = {
      timestamp: new Date().toISOString(),
      user: null,
      firebaseAuth: null,
      challenges: null,
      errors: [],
    };

    try {
      // Check user
      info.user = user ? {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      } : 'No user data';

      // Check Firebase auth
      info.firebaseAuth = firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
      } : 'Not authenticated';

      // Test 1: Try to fetch ALL challenges (no filter)
      try {
        console.log('Test 1: Fetching all challenges...');
        const allChallengesSnap = await getDocs(collection(db, 'challenges'));
        info.allChallengesCount = allChallengesSnap.size;
        info.allChallenges = allChallengesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('All challenges:', info.allChallenges);
      } catch (error: any) {
        info.errors.push({
          test: 'Fetch all challenges',
          error: error.message,
          code: error.code,
        });
        console.error('Error fetching all challenges:', error);
      }

      // Test 2: Try to fetch ACTIVE challenges
      try {
        console.log('Test 2: Fetching active challenges...');
        const q = query(
          collection(db, 'challenges'),
          where('status', '==', 'active')
        );
        const activeSnap = await getDocs(q);
        info.activeChallengesCount = activeSnap.size;
        info.activeChallenges = activeSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Active challenges:', info.activeChallenges);
      } catch (error: any) {
        info.errors.push({
          test: 'Fetch active challenges',
          error: error.message,
          code: error.code,
        });
        console.error('Error fetching active challenges:', error);
      }

      // Test 3: Check Firebase config
      info.firebaseConfig = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      };

    } catch (error: any) {
      info.errors.push({
        test: 'General diagnostics',
        error: error.message,
        stack: error.stack,
      });
      console.error('Diagnostic error:', error);
    }

    setDebugInfo(info);
    setTesting(false);
  };

  useEffect(() => {
    if (!userLoading) {
      runDiagnostics();
    }
  }, [userLoading]);

  if (userLoading) {
    return <div className="p-8">Loading user...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔍 Challenges Debug Tool</h1>
      <p className="text-gray-600 mb-6">
        This page helps diagnose why challenges aren't loading.
      </p>

      <button
        onClick={runDiagnostics}
        disabled={testing}
        className="mb-6 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {testing ? 'Running Diagnostics...' : 'Run Diagnostics Again'}
      </button>

      {Object.keys(debugInfo).length > 0 && (
        <div className="space-y-4">
          {/* User Info */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2">👤 User Info</h2>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.user, null, 2)}
            </pre>
          </div>

          {/* Firebase Auth */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2">🔐 Firebase Auth</h2>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.firebaseAuth, null, 2)}
            </pre>
          </div>

          {/* All Challenges */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2">📚 All Challenges</h2>
            <p className="text-sm text-gray-600 mb-2">
              Count: {debugInfo.allChallengesCount ?? 'Error'}
            </p>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-64">
              {JSON.stringify(debugInfo.allChallenges, null, 2)}
            </pre>
          </div>

          {/* Active Challenges */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2">✅ Active Challenges</h2>
            <p className="text-sm text-gray-600 mb-2">
              Count: {debugInfo.activeChallengesCount ?? 'Error'}
            </p>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-64">
              {JSON.stringify(debugInfo.activeChallenges, null, 2)}
            </pre>
          </div>

          {/* Firebase Config */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2">⚙️ Firebase Config</h2>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.firebaseConfig, null, 2)}
            </pre>
          </div>

          {/* Errors */}
          {debugInfo.errors && debugInfo.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="font-bold text-lg mb-2 text-red-800">❌ Errors</h2>
              <pre className="bg-white p-3 rounded text-sm overflow-auto max-h-64 text-red-600">
                {JSON.stringify(debugInfo.errors, null, 2)}
              </pre>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2 text-blue-800">💡 Quick Checks</h2>
            <ul className="space-y-2 text-sm">
              <li>✓ Are you logged in? {user ? '✅ Yes' : '❌ No'}</li>
              <li>✓ Do challenges exist? {debugInfo.allChallengesCount > 0 ? '✅ Yes' : '❌ No'}</li>
              <li>✓ Are challenges active? {debugInfo.activeChallengesCount > 0 ? '✅ Yes' : '❌ No'}</li>
              <li>✓ Any Firestore errors? {debugInfo.errors?.length > 0 ? '❌ Yes' : '✅ No'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

