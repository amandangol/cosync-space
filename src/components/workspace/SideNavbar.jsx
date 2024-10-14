'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { db } from '@config/firebaseConfig'
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { Bell, Loader } from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import Logo from '../Logo'
import List from './List'
import Notification from './Notification'

const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT

const SideNavbar = ({ params }) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    params && getDocumentList()
  }, [params])

  const getDocumentList = () => {
    const q = query(
      collection(db, 'documents'),
      where('workspaceID', '==', String(params?.workspaceid)),
    )

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setDocuments(data)
    })
  }

  const handleCreateDocument = async () => {
    if (documents?.length >= MAX_DOCUMENTS_COUNT) {
      toast('Upgrade required', {
        description:
          'You have reached the maximum number of files. Upgrade your plan to create more documents.',
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

    router.replace(`/workspace/${params?.workspaceid}/${documentID}`)
    setLoading(false)
  }

  return (
    <div className="fixed hidden h-screen p-5 shadow-md md:block md:w-72">
      <div className="flex items-center justify-between border-b pb-5">
        <Logo />
        <Notification>
          <Bell />
        </Notification>
      </div>
      <div className="my-6 flex items-center justify-between">
        <h2 className="font-semibold">Workspace Name</h2>
        <Button onClick={handleCreateDocument} size="sm" className="text-lg">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : '+'}
        </Button>
      </div>
      <List params={params} documents={documents} />
      <div className="absolute bottom-10 w-[85%] p-4">
        <Progress
          value={(documents?.length / MAX_DOCUMENTS_COUNT) * 100}
          className="h-2 rounded-full bg-gray-300"
        />
        <h2 className="mt-4 text-sm font-medium text-gray-700">
          <span className="font-bold text-gray-900">{documents?.length}</span>{' '}
          out of <span className="font-bold text-gray-900">5</span> files used
        </h2>
        <h2 className="mt-2 text-sm font-light text-gray-500">
          Upgrade your plan for unlimited access
        </h2>
      </div>
    </div>
  )
}

export default SideNavbar
