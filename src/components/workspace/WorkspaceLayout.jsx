import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react';
import { db } from '@/config/firebaseConfig';
import { collection, doc, onSnapshot, query, setDoc, where, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import Sidebar from './Sidebar';
import Main from './Main';
import CommentSection from './CommentSection';
import { getUsersFromFirestore, getMentionSuggestions } from '@/lib/userUtils';

const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 5;

const WorkspaceLayout = ({ params }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('/images/default-cover.png');
  const [emojiIcon, setEmojiIcon] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const getDocumentList = useCallback(() => {
    const q = query(
      collection(db, 'documents'),
      where('workspaceID', '==', String(params?.workspaceid))
    );

    return onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(data);
    });
  }, [params?.workspaceid]);

  const getDocument = useCallback(async () => {
    try {
      const docRef = doc(db, 'documents', params.documentid);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setDocumentInfo(docData);
          setEmojiIcon(docData.emoji);
          docData.cover && setImage(docData.cover);
        }
      });
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  }, [params.documentid]);

  useEffect(() => {
    if (params?.workspaceid) {
      getDocumentList();
    }
    if (params?.documentid) {
      getDocument();
    }
  }, [params, getDocumentList, getDocument]);

  const handleCreateDocument = async () => {
    if (documents?.length >= MAX_DOCUMENTS_COUNT) {
      toast('Upgrade required', {
        description: 'You have reached the maximum number of files. Upgrade your plan to create more documents.',
        action: {
          label: 'Upgrade',
          onClick: () => console.log('Upgrade clicked'),
        },
      });
      return;
    }

    setLoading(true);

    try {
      const documentID = uuidv4();
      await setDoc(doc(db, 'documents', documentID), {
        id: documentID,
        workspaceID: params?.workspaceid,
        owner: user?.primaryEmailAddress?.emailAddress,
        name: 'Untitled Document',
        cover: null,
        emoji: null,
        documentOutput: [],
      });

      await setDoc(doc(db, 'documentOutput', documentID), {
        id: documentID,
        output: [],
      });

      router.push(`/workspace/${params?.workspaceid}/${documentID}`);
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async docId => {
    try {
      await deleteDoc(doc(db, 'documents', docId));
      toast.success('Document Deleted!');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const updateDocument = async (key, value) => {
    try {
      const docRef = doc(db, 'documents', params.documentid);
      await setDoc(docRef, { [key]: value }, { merge: true });
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };
  
  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?roomId=${params?.documentid || '1'}`}
      resolveUsers={getUsersFromFirestore}
      resolveMentionSuggestions={getMentionSuggestions}
    >
      <RoomProvider id={params?.documentid || '1'}>
        <ClientSideSuspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          {() => (
            <div className="flex h-screen bg-gray-100">
              <Sidebar
                documents={documents}
                loading={loading}
                params={params}
                router={router}
                handleCreateDocument={handleCreateDocument}
                handleDeleteDocument={handleDeleteDocument}
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
              <div className={`flex-1 flex flex-col overflow-hidden`}>
                <Main 
                  params={params}
                  documentInfo={documentInfo}
                  image={image}
                  emojiIcon={emojiIcon}
                  updateDocument={updateDocument}
                  documents={documents}
                  handleCreateDocument={handleCreateDocument}
                  handleDeleteDocument={handleDeleteDocument}
                  user={user}
                  router={router}
                  toggleSidebar={toggleSidebar}
                  isCollapsed={isCollapsed}
                />
                <CommentSection />
              </div>
            </div>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default WorkspaceLayout;