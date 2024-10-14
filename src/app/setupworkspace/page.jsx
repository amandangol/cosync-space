'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { db } from '@config/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CoverModal from '@/components/CoverModal'
import { EmojiSelector } from '@/components/EmojiSelector'

const SetupWorkspace = () => {
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('/images/cover.png')
  const [workspaceName, setWorkspaceName] = useState('')
  const [emojiIcon, setEmojiIcon] = useState(null)
  const { user } = useUser()
  const { orgId } = useAuth()
  const router = useRouter()

  const createWorkspace = async () => {
    setLoading(true)
    const workspaceID = Date.now().toString()

    try {
      await setDoc(doc(db, 'workspaces', workspaceID), {
        id: workspaceID,
        name: workspaceName,
        cover: image,
        emoji: emojiIcon,
        owner: user?.primaryEmailAddress?.emailAddress,
        organization: orgId ? orgId : user?.primaryEmailAddress?.emailAddress,
      })

      const documentID = uuidv4()
      await setDoc(doc(db, 'documents', documentID), {
        id: documentID,
        workspaceID: workspaceID,
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

      router.replace(`/workspace/${workspaceID}/${documentID}`)
    } catch (error) {
      console.error('Error creating workspace:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const isCreateDisabled = !workspaceName.trim().length || loading

  return (
    <div className="container px-6 py-20 md:px-20 lg:px-36 xl:px-48">
      <div className="rounded-xl bg-white shadow-lg">
        <CoverModal setNewCover={setImage}>
          <div className="group relative cursor-pointer">
            <p className="absolute inset-0 hidden items-center justify-center rounded-t-xl bg-black/50 text-lg font-semibold text-white group-hover:flex">
              Change Cover
            </p>
            <div className="group-hover:opacity-50">
              <Image
                src={image}
                alt="Workspace cover"
                width={2000}
                height={2000}
                className="h-[150px] w-full rounded-t-xl object-cover"
              />
            </div>
          </div>
        </CoverModal>
        <div className="p-6 md:p-10">
          <h2 className="text-2xl font-semibold text-primary">
            Create new workspace
          </h2>
          <p className="mt-2 text-gray-600">
            This workspace is where your team can collaborate and organize
            projects. You can always update its name later.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <EmojiSelector setEmojiIcon={setEmojiIcon} emojiIcon={emojiIcon} />
            <Input
              placeholder="Workspace Name"
              value={workspaceName}
              onChange={e => setWorkspaceName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={createWorkspace} disabled={isCreateDisabled}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupWorkspace
