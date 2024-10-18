'use client'

import Loader from '@components/Loader'
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense'
import { getUsersFromFirestore, getMentionSuggestions } from '@/lib/firebaseUserUtils'

export function Room({ children, params }) {
  const roomId = params?.documentid || '1'

  const resolveUsers = async ({ userIds }) => {
    console.log('Resolving users for IDs:', userIds);
    const users = await getUsersFromFirestore(userIds);
    console.log('Resolved users:', users);
    return users;
  }

  const resolveMentionSuggestions = async ({ text }) => {
    console.log('Resolving mention suggestions for text:', text);
    const suggestions = await getMentionSuggestions(text);
    console.log('Resolved mention suggestions:', suggestions);
    return suggestions;
  }

  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?roomId=${roomId}`}
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
    >
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}