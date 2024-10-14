'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react'
import { db } from '@/config/firebaseConfig'
import { collection, doc, onSnapshot, query, setDoc, where, deleteDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import Sidebar from './Sidebar'
import { Button } from '../ui/button'
import DocumentContent from './DocumentContent'
import CommentSection from './CommentSection'
import Main from './Main'
import { PlusCircle } from 'lucide-react'
import { EmojiSelector } from '../EmojiSelector'

import { getUsersFromFirestore, getMentionSuggestions } from '@/lib/userUtils'

const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 5

const WorkspaceLayout = ({ params }) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('/images/cover.png')
  const [emojiIcon, setEmojiIcon] = useState(null)
  const [documentInfo, setDocumentInfo] = useState(null)
  const [openComment, setOpenComment] = useState(false)
  const { user } = useUser()
  const router = useRouter()

  const getDocumentList = useCallback(() => {
    const q = query(
      collection(db, 'documents'),
      where('workspaceID', '==', String(params?.workspaceid))
    )

    return onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setDocuments(data)
    })
  }, [params?.workspaceid])

  const getDocument = useCallback(async () => {
    try {
      const docRef = doc(db, 'documents', params.documentid)
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data()
          setDocumentInfo(docData)
          setEmojiIcon(docData.emoji)
          docData.cover && setImage(docData.cover)
        }
      })
    } catch (error) {
      console.error('Error fetching document:', error)
    }
  }, [params.documentid])

  useEffect(() => {
    if (params?.workspaceid) {
      getDocumentList()
    }
    if (params?.documentid) {
      getDocument()
    }
  }, [params, getDocumentList, getDocument])

  const handleCreateDocument = async () => {
    if (documents?.length >= MAX_DOCUMENTS_COUNT) {
      toast('Upgrade required', {
        description: 'You have reached the maximum number of files. Upgrade your plan to create more documents.',
        action: {
          label: 'Upgrade',
          onClick: () => console.log('Upgrade clicked'),
        },
      })
      return
    }

    setLoading(true)

    try {
      const documentID = uuidv4()
      await setDoc(doc(db, 'documents', documentID), {
        id: documentID,
        workspaceID: params?.workspaceid,
        owner: user?.primaryEmailAddress?.emailAddress,
        name: 'Untitled Document',
        cover: null,
        emoji: null,
        documentOutput: [],
      })

      await setDoc(doc(db, 'documentOutput', documentID), {
        id: documentID,
        output: [],
      })

      router.push(`/workspace/${params?.workspaceid}/${documentID}`)
    } catch (error) {
      console.error('Error creating document:', error)
      toast.error('Failed to create document')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async docId => {
    try {
      await deleteDoc(doc(db, 'documents', docId))
      toast.success('Document Deleted!')
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document')
    }
  }

  const updateDocument = async (key, value) => {
    try {
      const docRef = doc(db, 'documents', params.documentid)
      await setDoc(docRef, { [key]: value }, { merge: true })
    } catch (error) {
      console.error('Error updating document:', error)
      toast.error('Failed to update document')
    }
  }
  
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
                router={router}
                handleCreateDocument={handleCreateDocument}
                handleDeleteDocument={handleDeleteDocument}
              />
              <div className="flex-1 flex flex-col overflow-hidden">
             
                {/* Main Component with Conditional Rendering */}
                <div className={`flex-1 p-8 ${params?.documentid ? '' : 'flex items-center justify-center'}`}>
                  {params?.documentid ? (
                    <Main 
                      params={params}
                      documentInfo={documentInfo}
                      image={image}
                      emojiIcon={emojiIcon}
                      updateDocument={updateDocument}
                      documents={documents}
                      handleCreateDocument={handleCreateDocument}
                    />
                  ) : (
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-700 mb-4">Welcome to Your Workspace</h2>
                      <p className="text-lg text-gray-500 mb-8">Select an existing document or create a new one to get started.</p>
                      <Button onClick={handleCreateDocument} className="flex items-center mx-auto bg-blue-600 text-white">
                        <PlusCircle className="mr-2" />
                        Create New Document
                      </Button>
                    </div>
                  )}
                </div>
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
  );
};

export default WorkspaceLayout;