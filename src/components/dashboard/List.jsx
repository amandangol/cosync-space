'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth, useUser } from '@clerk/nextjs'
import { db } from '@config/firebaseConfig'
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import Item from './Item'

const List = () => {
  const { user } = useUser()
  const { orgId } = useAuth()
  const [workspaceList, setWorkspaceList] = useState([])

  const fetchWorkspaceList = useCallback(() => {
    if (!user) return

    const q = query(
      collection(db, 'workspaces'),
      where('organization', '==', orgId || user?.primaryEmailAddress?.emailAddress)
    )

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setWorkspaceList(data)
    })
  }, [user, orgId])

  useEffect(() => {
    const unsubscribe = fetchWorkspaceList()
    return () => unsubscribe && unsubscribe()
  }, [fetchWorkspaceList])

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'workspaces', id))
      toast('Workspace deleted successfully')
    } catch (error) {
      console.error('Error deleting workspace:', error)
      toast.error('Failed to delete workspace')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Workspaces</h1>
        <Link href="/setupworkspace">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Workspace</span>
          </Button>
        </Link>
      </div>
      <Item workspaceList={workspaceList} onDelete={handleDelete} />
    </div>
  )
}

export default List