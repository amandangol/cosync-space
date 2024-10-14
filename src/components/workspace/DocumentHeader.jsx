// components/workspace/Header.js
import React from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmojiSelector } from '@/components/EmojiSelector'
import { updateDocument } from '@/lib/documentUtils'

const Header = ({ documentInfo, user }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <EmojiSelector
          setEmojiIcon={emoji => updateDocument(documentInfo.id, 'emoji', emoji)}
          emojiIcon={documentInfo?.emoji || "📄"}
        />
        <input
          type="text"
          defaultValue={documentInfo?.name}
          onBlur={e => updateDocument(documentInfo.id, 'name', e.target.value)}
          className="text-2xl font-bold outline-none"
          placeholder="Untitled Document"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline">Share</Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <User className="text-gray-500 hover:text-gray-700 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Settings className="mr-2" size={16} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2" size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header