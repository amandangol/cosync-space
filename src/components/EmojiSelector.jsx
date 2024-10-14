'use client'

import { memo, useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { SmilePlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const EmojiSelector = memo(({ setEmojiIcon, emojiIcon }) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)

  const togglePicker = () => setOpenEmojiPicker(prev => !prev)

  return (
    <div className="relative">
      <Button variant="outline" className="p-2" onClick={togglePicker}>
        {emojiIcon ? (
          <span className="text-xl">{emojiIcon}</span>
        ) : (
          <SmilePlusIcon className="text-primary" />
        )}
      </Button>
      {openEmojiPicker && (
        <div className="absolute z-10 mt-2">
          <EmojiPicker
            emojiStyle="native"
            onEmojiClick={e => {
              setEmojiIcon(e.emoji)
              setOpenEmojiPicker(false)
            }}
          />
        </div>
      )}
    </div>
  )
})
