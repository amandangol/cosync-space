import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react';
import { db } from '@/config/firebaseConfig';
import { collection, doc, onSnapshot, query, setDoc, where, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@components/workspace/Sidebar';
import Main from '@components/workspace/Main';
import CommentSection from '@components/workspace/CommentSection';
import { getUsersFromFirestore, getMentionSuggestions } from '@/lib/userUtils';
import PageTransition from '@components/workspace/PageTransition';
import WorkspaceSkeleton from '@components/workspace/WorkspaceSkeleton';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 8;

const WorkspaceLayout = ({ params }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    });
  }, [params?.workspaceid]);

  const getDocument = useCallback(async () => {
    try {
      const docRef = doc(db, 'documents', params.documentid);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setDocumentInfo(docData);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      setLoading(false);
    }
  }, [params.documentid]);

  useEffect(() => {
    setLoading(true);
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
      setDocumentInfo(prevInfo => ({ ...prevInfo, [key]: value }));
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  if (loading) {
    return <WorkspaceSkeleton />;
  }
  
  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?roomId=${params?.documentid || '1'}`}
      resolveUsers={getUsersFromFirestore}
      resolveMentionSuggestions={getMentionSuggestions}
    >
      <RoomProvider id={params?.documentid || '1'}>
        <ClientSideSuspense fallback={<WorkspaceSkeleton />}>
          {() => (
            <PageTransition>
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
                <div className="flex-1 flex flex-col overflow-hidden">
                  <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                        <Menu className="h-6 w-6" />
                      </Button>
                      <h1 className="text-2xl font-bold">Workspace</h1>
                    </div>
                    {/* Add any header actions or components here */}
                  </header>
                  <main className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-auto">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={params?.documentid || 'main'}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Main 
                            params={params}
                            documentInfo={documentInfo}
                            updateDocument={updateDocument}
                            documents={documents}
                            handleCreateDocument={handleCreateDocument}
                            handleDeleteDocument={handleDeleteDocument}
                            user={user}
                            router={router}
                            toggleSidebar={toggleSidebar}
                            isCollapsed={isCollapsed}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {params?.documentid && (
                        <motion.div 
                          initial={{ opacity: 0, x: 300 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 300 }}
                          transition={{ duration: 0.3 }}
                          className="w-80 border-l bg-white"
                        >
                          <CommentSection />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </main>
                </div>
              </div>
            </PageTransition>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default WorkspaceLayout;