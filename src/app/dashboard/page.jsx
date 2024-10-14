import React from 'react'

import Header from '@/components/dashboard/Header'
import List from '@/components/dashboard/List'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <List />
      </main>
    </div>
  )
}

export default Dashboard