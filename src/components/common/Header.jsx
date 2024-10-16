import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';

const Header = () => (
  <header className="bg-white border-b border-gray-200">
    <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2"> 
      <Link href="/cosyncspace-dashboard" className="flex items-center space-x-2">
        <Image
          src="/images/logo.svg" 
          alt="CoSyncSpace Logo"
          width={200} 
          height={50} 
          className="text-indigo-600"
        />
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

