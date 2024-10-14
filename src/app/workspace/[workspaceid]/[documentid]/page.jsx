'use client'

import React from 'react'
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout'
import Header from '@components/common/Header'
import Footer from '@components/common/Footer'

const Document = ({ params }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <WorkspaceLayout params={params} />
      </main>
      <Footer />
    </div>
  )
}

export default Document
