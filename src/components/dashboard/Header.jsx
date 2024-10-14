import React from 'react'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Logo from '../Logo'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/dashboard"
            afterLeaveOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: 'flex items-center',
                organizationSwitcherTrigger: 'py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200',
              },
            }}
          />
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}

export default Header