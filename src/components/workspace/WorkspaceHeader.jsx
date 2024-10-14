import React from 'react'
import { Button } from '@/components/ui/button'
import { EmojiSelector } from '@/components/EmojiSelector'

const Header = ({ documentInfo, user, updateDocument }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <EmojiSelector
          setEmojiIcon={emoji => updateDocument('emoji', emoji)}
          emojiIcon={documentInfo?.emoji || "📄"}
        />
        <input
          type="text"
          defaultValue={documentInfo?.name}
          onBlur={e => updateDocument('name', e.target.value)}
          className="text-2xl font-bold outline-none"
          placeholder="Untitled Document"
        />
      </div>
      {/* <div className="flex items-center space-x-4">
        <Button variant="outline">Share</Button>
       
      </div> */}
    </header>
  )
}

export default Header