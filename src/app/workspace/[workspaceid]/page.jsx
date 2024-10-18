'use client'

import { Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout'
import Header from '@/components/common/Header'

export default function WorkspacePage({ params }) {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    redirect('/sign-in')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <WorkspaceLayout params={params} />
    </Suspense>
  )
}