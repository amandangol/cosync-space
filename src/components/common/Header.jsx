"use client";
import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, OrganizationSwitcher, useAuth, useUser } from '@clerk/nextjs';
import { db } from '@/config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const Header = () => {
  const { orgId } = useAuth();
  const { user } = useUser();

  // Memoized function to avoid recreating the function on every render
  const saveUserData = useCallback(async () => {
    if (!user) return;

    const docId = user.primaryEmailAddress?.emailAddress;
    try {
      await setDoc(doc(db, 'LoopUsers', docId), {
        name: user.fullName,
        avatar: user.imageUrl,
        email: user.primaryEmailAddress?.emailAddress,
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }, [user]);

  // Trigger saveUserData when the user object changes
  useEffect(() => {
    saveUserData();
  }, [saveUserData]);

  return (
    <header className="bg-gradient-to-r from-gray-900 to-black text-white shadow-md">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/cosyncspace-dashboard" aria-label="CoSyncSpace Dashboard">
            <Image
              src="/images/logo-white.svg"
              alt="CoSyncSpace Logo"
              width={200}
              height={50}
              className="mr-2"
              priority // Ensures the logo loads quickly
            />
          </Link>
        </div>
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          <Link href="/cosyncspace-dashboard" className="text-gray-300 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/workspaces" className="text-gray-300 hover:text-white transition">
            Workspaces
          </Link>
        </nav>
        {/* User and Organization Section */}
        <div className="flex items-center space-x-4">
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox: "py-2 px-4",
                organizationSwitcherTrigger: "py-2 px-4 bg-gray-800 text-white rounded-md",
              },
            }}
          />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
