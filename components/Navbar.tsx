'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { signOutUser } from '@/lib/firebase/auth-service';
import { toast } from 'react-toastify';
import { FiUser, FiLogOut, FiHome, FiBook, FiAward } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';
import { useState } from 'react';

export default function Navbar() {
  const { user, isMentor, isStudent } = useUser();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
      router.push(ROUTES.HOME);
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="text-2xl font-bold text-primary-600">
            Skill Sphere
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href={isMentor ? ROUTES.MENTOR_DASHBOARD : ROUTES.STUDENT_DASHBOARD}
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
            >
              <FiHome className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href={ROUTES.CHALLENGES}
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
            >
              <FiBook className="w-5 h-5" />
              <span>Challenges</span>
            </Link>

            {isStudent && (
              <Link
                href={ROUTES.CERTIFICATES}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
              >
                <FiAward className="w-5 h-5" />
                <span>Certificates</span>
              </Link>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
              >
                <FiUser className="w-5 h-5" />
                <span>{user?.displayName}</span>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <Link
                      href={ROUTES.PROFILE}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    {isStudent && (
                      <Link
                        href={ROUTES.PORTFOLIO(user?.id || '')}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Portfolio
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

