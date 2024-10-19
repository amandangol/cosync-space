"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, OrganizationSwitcher, useAuth } from '@clerk/nextjs';
import { useSyncUserData } from '@lib/useSyncUserData';

const Header = () => {
  const { orgId } = useAuth();
  useSyncUserData();

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/cosyncspace-dashboard" aria-label="CoSyncSpace Dashboard">
            <Image
              src="/images/logo-white.svg"
              alt="CoSyncSpace Logo"
              width={200}
              height={50}
              className="mr-2"
              priority
            />
          </Link>
        </div>
        {/* Navigation Links */}
        {/* <nav className="hidden md:flex space-x-4">
          <Link href="/cosyncspace-dashboard" className="text-gray-300 hover:text-blue-400 transition duration-200">
            Dashboard
          </Link>
          <Link href="/workspaces" className="text-gray-300 hover:text-blue-400 transition duration-200">
            Workspaces
          </Link>
        </nav> */}
        {/* User and Organization Section */}
        <div className="flex items-center space-x-4">
        <OrganizationSwitcher
  appearance={{
    elements: {
      rootBox: "py-2 px-4 bg-gray-800 border border-gray-700 rounded-md",
      organizationSwitcherTrigger:
        "py-2 px-4 bg-gray-700 text-white rounded-md transition duration-200 hover:bg-gray-600 hover:text-blue-300",
      organizationPopoverCard: "bg-gray-800 border border-gray-700 rounded-md shadow-lg",
      organizationItem:
        "text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200 px-4 py-2",
      organizationItemActive: "bg-gray-700 text-white",
      organizationItemIcon: "text-gray-400",
    },
  }}
/>
<UserButton
  appearance={{
    elements: {
      avatarBox: "w-10 h-10",
      userButtonPopoverCard: "bg-gray-800 border border-gray-700",
      userPreview: "bg-gray-800",
      userButtonPopoverActions: "bg-gray-800",
      userButtonPopoverActionButton:
        "text-gray-200 hover:text-white hover:bg-gray-700 transition-colors duration-200",
      userPreviewMainIdentifier: "text-gray-200",
      userPreviewSecondaryIdentifier: "text-gray-400",
    },
  }}
/>

        </div>
      </div>
    </header>
  );
};

export default Header;