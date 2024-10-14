'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import Comments from './Comments'
import DocumentArticle from './DocumentArticle'
import DocumentHeader from './DocumentHeader'
import Editor from './Editor'

const Main = ({ params }) => {
  const [openComment, setOpenComment] = useState(false)

  return (
    <div className="relative">
      <DocumentHeader />
      <DocumentArticle params={params} />
      <Editor params={params} />

      <div className="fixed bottom-10 right-10">
        <Button onClick={() => setOpenComment(!openComment)}>
          {openComment ? <X /> : <MessageCircle />}{' '}
        </Button>
        {openComment && <Comments />}
      </div>
    </div>
  )
}

export default Main
