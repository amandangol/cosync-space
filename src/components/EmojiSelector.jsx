import { memo, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { SmilePlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmojiSelector = memo(({ setEmojiIcon, emojiIcon }) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const togglePicker = () => setOpenEmojiPicker(prev => !prev);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-2xl bg-gray-800 hover:bg-gray-700 text-white"
        onClick={togglePicker}
      >
        {emojiIcon ? (
          emojiIcon
        ) : (
          <SmilePlusIcon className="h-6 w-6 text-gray-400" />
        )}
      </Button>
      {openEmojiPicker && (
        <div className="absolute z-10 mt-2">
          <EmojiPicker
            onEmojiClick={(e) => {
              setEmojiIcon(e.emoji);
              setOpenEmojiPicker(false);
            }}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
});