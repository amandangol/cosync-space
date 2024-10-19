"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { getUsersFromFirestore, getMentionSuggestions } from '@/lib/firebaseUserUtils';

export function Room({ children, params }) {
  return (
    <LiveblocksProvider 
      authEndpoint={"/api/liveblocks-auth?roomId=" + params?.documentid}
      resolveUsers={async (userIds) => {
        console.log('Resolving users for IDs:', userIds);
        const users = await getUsersFromFirestore(userIds);
        return users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        console.log('Resolving mention suggestions. Text:', text, 'Room ID:', roomId);
        return getMentionSuggestions(text);
      }}
    >
      <RoomProvider id={params?.documentid} initialPresence={{}}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}