'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense'
import { useThreads } from '@liveblocks/react'
import { Composer, Thread } from '@liveblocks/react-ui'
import { db } from '@config/firebaseConfig'
import { collection, doc, onSnapshot, query, setDoc, where, deleteDoc, getDocs } from 'firebase/firestore'
import { Bell, Loader, FileText, MoreVertical, MessageCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import EditorJS from '@editorjs/editorjs'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 5

const WorkspaceContent = ({ params, documents, loading, handleCreateDocument, handleDeleteDocument, documentInfo, image, emojiIcon, updateDocument }) => {
  const [openComment, setOpenComment] = useState(false)
  const { threads } = useThreads()
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between border-b pb-5">
          <h1 className="text-xl font-bold">Logo</h1>
          <Bell className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Workspace Name</h2>
          <Button onClick={handleCreateDocument} size="sm" className="text-lg">
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : '+'}
          </Button>
        </div>
        <nav className="mt-6">
          {documents.map(doc => (
            <div
              key={doc?.id}
              onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
              className={`mt-2 flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-100 ${
                doc?.id === params?.documentid ? 'bg-gray-200' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {doc.emoji || <FileText className="text-gray-500" size={20} />}
                <span className="truncate">{doc.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDeleteDocument(doc?.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </nav>
        <div className="absolute bottom-6 w-52">
          <Progress
            value={(documents?.length / MAX_DOCUMENTS_COUNT) * 100}
            className="h-2 rounded-full bg-gray-200"
          />
          <p className="mt-2 text-sm text-gray-600">
            {documents?.length} out of {MAX_DOCUMENTS_COUNT} files used
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Upgrade for unlimited access
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {params?.documentid ? (
          <>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={image}
                  alt="Document cover"
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center">
                  <p className="text-white font-semibold">Change Cover</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-3xl mr-4">{emojiIcon || '📄'}</span>
                <input
                  type="text"
                  defaultValue={documentInfo?.name}
                  onBlur={e => updateDocument('name', e.target.value)}
                  className="text-2xl font-bold outline-none"
                  placeholder="Untitled Document"
                />
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div id="editorjs" />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xl text-gray-500">Select a document or create a new one</p>
          </div>
        )}
      </main>

      {/* Comment section */}
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
    </div>
  )
}

const Workspace = ({ params }) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('/images/cover.png')
  const [emojiIcon, setEmojiIcon] = useState(null)
  const [documentInfo, setDocumentInfo] = useState(null)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    params && getDocumentList()
    params?.documentid && getDocument()
  }, [params])

  const getDocumentList = () => {
    const q = query(
      collection(db, 'documents'),
      where('workspaceID', '==', String(params?.workspaceid))
    )

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setDocuments(data)
    })
  }

  const getDocument = async () => {
    try {
      const docRef = doc(db, 'documents', params.documentid)
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
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
  }

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
    setLoading(false)
  }

  const handleDeleteDocument = async docId => {
    await deleteDoc(doc(db, 'documents', docId))
    toast('Document Deleted!')
  }

  const updateDocument = async (key, value) => {
    try {
      const docRef = doc(db, 'documents', params.documentid)
      await setDoc(docRef, { [key]: value }, { merge: true })
    } catch (error) {
      console.error('Error updating document:', error)
    }
  }

  const getUsersFromFirestore = async userIds => {
    const q = query(collection(db, 'users'), where('email', 'in', userIds))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data())
  }

  const getMentionSuggestions = async text => {
    const q = query(collection(db, 'users'), where('email', '!=', null))
    const querySnapshot = await getDocs(q)
    let userList = querySnapshot.docs.map(doc => doc.data())

    if (text) {
      userList = userList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase())
      )
    }

    return userList.map(user => user.email)
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
            <WorkspaceContent
              params={params}
              documents={documents}
              loading={loading}
              handleCreateDocument={handleCreateDocument}
              handleDeleteDocument={handleDeleteDocument}
              documentInfo={documentInfo}
              image={image}
              emojiIcon={emojiIcon}
              updateDocument={updateDocument}
            />
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

export default Workspace