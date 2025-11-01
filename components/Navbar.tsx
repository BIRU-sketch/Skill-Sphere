'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { signOutUser } from '@/lib/firebase/auth-service';
import { toast } from 'react-toastify';
import { FiUser, FiLogOut, FiHome, FiBook, FiAward, FiPlus, FiList, FiUserCheck, FiClipboard } from 'react-icons/fi';
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

            {/* Mentor Navigation */}
            {isMentor && (
              <>
                <Link
                  href={ROUTES.CREATE_CHALLENGE}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Create Challenge</span>
                </Link>
              </>
            )}

            {/* Student Navigation */}
            {isStudent && (
              <>
                <Link
                  href={ROUTES.CHALLENGES}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <FiBook className="w-5 h-5" />
                  <span>Browse</span>
                </Link>

                <Link
                  href={ROUTES.STUDENT_ENROLLMENTS}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <FiClipboard className="w-5 h-5" />
                  <span>My Enrollments</span>
                </Link>

                <Link
                  href={ROUTES.CERTIFICATES}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <FiAward className="w-5 h-5" />
                  <span>Certificates</span>
                </Link>
              </>
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    {/* Role Badge */}
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-primary-600 capitalize">
                        {user?.role}
                      </p>
                    </div>

                    {/* Mentor Menu Items */}
                    {isMentor && (
                      <>
                        <Link
                          href={ROUTES.MENTOR_DASHBOARD}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href={ROUTES.CREATE_CHALLENGE}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Create Challenge
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Edit Profile
                        </Link>
                      </>
                    )}

                    {/* Student Menu Items */}
                    {isStudent && (
                      <>
                        <Link
                          href={ROUTES.STUDENT_DASHBOARD}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href={ROUTES.CHALLENGES}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Browse Challenges
                        </Link>
                        <Link
                          href={ROUTES.STUDENT_ENROLLMENTS}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Enrollments
                        </Link>
                        <Link
                          href={ROUTES.CERTIFICATES}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Certificates
                        </Link>
                        <Link
                          href={ROUTES.PORTFOLIO(user?.id || '')}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Portfolio
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Edit Profile
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 mt-2 pt-2">
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

