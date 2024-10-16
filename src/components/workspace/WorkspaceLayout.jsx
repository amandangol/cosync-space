import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@components/workspace/Sidebar';
import Main from '@components/workspace/Main';
import CommentSection from '@components/workspace/CommentSection';
import { getUsersFromFirestore, getMentionSuggestions } from '@/lib/firebaseUserUtils';
import PageTransition from '@components/workspace/PageTransition';
import WorkspaceSkeleton from '@components/workspace/WorkspaceSkeleton';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

import { getDocumentList, getDocument, handleCreateDocument, handleDeleteDocument, updateDocument } from '@lib/firebaseDocumentUtils';

const WorkspaceLayout = ({ params }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    setLoading(true);
    let unsubscribe = () => {};

    if (params?.workspaceid) {
      unsubscribe = getDocumentList(params.workspaceid, setDocuments, setLoading);
    }

    return () => unsubscribe();
  }, [params?.workspaceid]);

  useEffect(() => {
    setLoading(true);
    let unsubscribe = () => {};

    if (params?.documentid) {
      unsubscribe = getDocument(params.documentid, setDocumentInfo, setLoading);
    }

    return () => unsubscribe();
  }, [params?.documentid]);

  const createDocument = () => handleCreateDocument(documents, params, user, router, setLoading);

  const deleteDocument = async (docId) => {
    await handleDeleteDocument(docId);
    if (docId === params?.documentid) {
      router.push(`/workspace/${params?.workspaceid}`);
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
                  handleCreateDocument={createDocument}
                  handleDeleteDocument={deleteDocument}
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
                            updateDocument={(key, value) => updateDocument(params?.documentid, key, value)}
                            documents={documents}
                            handleCreateDocument={createDocument}
                            handleDeleteDocument={deleteDocument}
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