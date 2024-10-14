'use client'

import Loader from '@components/Loader'
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense'
import { collection, getDocs, query, where } from 'firebase/firestore'

import { db } from '@config/firebaseConfig'

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
      user.name.toLowerCase().includes(text.toLowerCase()),
    )
  }

  return userList.map(user => user.email)
}

export function Room({ children, params }) {
  const roomId = params?.documentid || '1'

  const resolveUsers = async ({ userIds }) => {
    return await getUsersFromFirestore(userIds)
  }

  const resolveMentionSuggestions = async ({ text }) => {
    return await getMentionSuggestions(text)
  }

  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?roomId=${roomId}`}
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
    >
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
