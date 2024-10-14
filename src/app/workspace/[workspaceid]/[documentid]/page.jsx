'use client'

import { useEffect } from 'react'

import { Room } from '@/components/Room'
import Main from '@/components/workspace/Main'
import SideNavbar from '@/components/workspace/SideNavbar'

const Document = ({ params }) => {
  useEffect(() => {
    console.log(params)
  }, [])

  return (
    <Room params={params}>
      <div>
        <SideNavbar params={params} />
      </div>
      <div className="md:ml-72">
        <Main params={params} />
      </div>
    </Room>
  )
}

export default Document
