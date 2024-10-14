import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react'

import Sidebar from './Sidebar'
import Header from './DocumentHeader'
import DocumentContent from './DocumentContent'
import CommentSection from './CommentSection'
import { getDocumentList, getDocument, handleCreateDocument, handleDeleteDocument, updateDocument } from '@/lib/documentUtils'
import { getUsersFromFirestore, getMentionSuggestions } from '@/lib/userUtils'

const WorkspaceLayout = ({ params }) => {
  const [documents, setDocuments] = useState([])
  const [documentInfo, setDocumentInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openComment, setOpenComment] = useState(false)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (params?.workspaceid) {
      getDocumentList(params.workspaceid, setDocuments)
    }
    if (params?.documentid) {
      getDocument(params.documentid, setDocumentInfo)
    }
  }, [params])

  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?roomId=${params?.documentid || '1'}`}
      resolveUsers={getUsersFromFirestore}
      resolveMentionSuggestions={getMentionSuggestions}
    >
      <RoomProvider id={params?.documentid || '1'}>
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {() => (
            <div className="flex h-screen bg-gray-100">
              <Sidebar
                documents={documents}
                loading={loading}
                params={params}
                setLoading={setLoading}
                user={user}
                router={router}
                handleCreateDocument={() => handleCreateDocument(documents, params, user, router, setLoading)}
                handleDeleteDocument={handleDeleteDocument}
              />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header documentInfo={documentInfo} user={user} updateDocument={(key, value) => updateDocument(params.documentid, key, value)} />
                <DocumentContent
                  params={params}
                  documentInfo={documentInfo}
                  user={user}
                  updateDocument={(key, value) => updateDocument(params.documentid, key, value)}
                />
                <CommentSection
                  openComment={openComment}
                  setOpenComment={setOpenComment}
                />
              </div>
            </div>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

export default WorkspaceLayout