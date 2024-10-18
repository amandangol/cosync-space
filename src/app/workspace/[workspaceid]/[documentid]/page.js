'use client'

import React from 'react'
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout'
import Header from '@components/common/Header'

const Document = ({ params }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
      <Header />
        <WorkspaceLayout params={params} />
      </main>
    </div>
  )
}

export default Document