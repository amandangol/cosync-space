import React from 'react'
import { useThreads } from '@liveblocks/react'
import { Composer, Thread } from '@liveblocks/react-ui'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CommentSection = ({ openComment, setOpenComment }) => {
  const { threads } = useThreads()

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Button
        onClick={() => setOpenComment(!openComment)}
        className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
      >
        {openComment ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      {openComment && (
        <div className="absolute bottom-16 right-0 h-[350px] w-[300px] overflow-auto rounded-lg bg-white p-4 shadow-xl">
          {threads?.map(thread => (
            <Thread key={thread.id} thread={thread} />
          ))}
          <Composer>
            <Composer.Submit className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Reply
            </Composer.Submit>
          </Composer>
        </div>
      )}
    </div>
  )
}

export default CommentSection