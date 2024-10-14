import React from 'react';
import Link from 'next/link';
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';
import Logo from '@components/common/Logo';


const Header = () => (
  <header className="bg-white shadow-sm">
    <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
      <Link href="/syncspace-dashboard" className="flex items-center space-x-2">
        <Logo className="w-8 h-8 text-indigo-600" />
        <span className="text-2xl font-semibold text-gray-800">SyncSpace</span>
      </Link>
      <div className="flex items-center space-x-4">
        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
              organizationSwitcherTrigger: {
                padding: '6px',
                color: 'rgb(107 114 128)',
                backgroundColor: 'rgb(243 244 246)',
                borderRadius: '6px',
              },
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: '40px',
                height: '40px',
              },
            },
          }}
        />
      </div>
    </div>
  </header>
);

export default Header;