import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react';
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from '@components/workspace/Sidebar';
import Main from '@components/workspace/Main';
import CommentSidebar from '@components/workspace/CommentSidebar';
import Whiteboard from '@components/workspace/Whiteboard';
import { getUsersFromFirestore, getMentionSuggestions } from '@/lib/firebaseUserUtils';
import WorkspaceSkeleton from '@components/workspace/WorkspaceSkeleton';
import { Button } from '@/components/ui/button';
import { Menu, PenTool, X, Loader } from 'lucide-react';

import { getDocumentList, getDocument, handleCreateDocument, handleDeleteDocument, updateDocument } from '@/lib/firebaseDocumentUtils';
import { getWhiteboardData, updateWhiteboardData } from '@/lib/firebaseWhiteboardUtils';

const WorkspaceLayout = ({ params }) => {
  const [documents, setDocuments] = useState([]);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [whiteboardData, setWhiteboardData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isWhiteboardMode, setIsWhiteboardMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingDocument, setIsChangingDocument] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCommentSidebar = () => setIsCommentSidebarOpen(!isCommentSidebarOpen);
  const toggleWhiteboardMode = () => setIsWhiteboardMode(!isWhiteboardMode);

  useEffect(() => {
    let unsubscribe = () => {};

    if (params?.workspaceid) {
      unsubscribe = getDocumentList(params.workspaceid, setDocuments, setIsLoading);
    }

    return () => unsubscribe();
  }, [params?.workspaceid]);

  useEffect(() => {
    let unsubscribeDoc = () => {};
    let unsubscribeWhiteboard = () => {};

    if (params?.documentid) {
      setIsChangingDocument(true);
      unsubscribeDoc = getDocument(params.documentid, setDocumentInfo, () => setIsChangingDocument(false));
      unsubscribeWhiteboard = getWhiteboardData(params.documentid, setWhiteboardData, () => {});
    } else {
      setDocumentInfo(null);
      setWhiteboardData(null);
      setIsChangingDocument(false);
    }

    return () => {
      unsubscribeDoc();
      unsubscribeWhiteboard();
    };
  }, [params?.documentid]);

  const createDocument = useCallback(() => {
    setIsChangingDocument(true);
    handleCreateDocument(documents, params, user, router, () => setIsChangingDocument(false));
  }, [documents, params, user, router]);

  const deleteDocument = useCallback(async (docId) => {
    setIsChangingDocument(true);
    await handleDeleteDocument(docId);
    if (docId === params?.documentid) {
      router.push(`/workspace/${params?.workspaceid}`);
    }
    setIsChangingDocument(false);
  }, [params, router]);

  const handleWhiteboardUpdate = useCallback((newData) => {
    if (params?.documentid) {
      updateWhiteboardData(params.documentid, newData);
    }
  }, [params?.documentid]);

  if (!user) {
    return <WorkspaceSkeleton />;
  }

  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?roomId=${params?.documentid || '1'}`}
      resolveUsers={getUsersFromFirestore}
      resolveMentionSuggestions={getMentionSuggestions}
    >
      <RoomProvider id={params?.documentid || '1'} >
        <ClientSideSuspense fallback={<WorkspaceSkeleton />}>
          {() => (
            <div className="flex h-screen bg-gray-900 text-white">
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ duration: 0.3 }}
                    className="w-64 border-r border-gray-700 bg-gray-800"
                  >
                    <Sidebar
                      documents={documents}
                      loading={isChangingDocument}
                      params={params}
                      router={router}
                      handleCreateDocument={createDocument}
                      handleDeleteDocument={deleteDocument}
                      isCollapsed={isCollapsed}
                      toggleSidebar={toggleSidebar}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-800 shadow-sm p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 text-gray-300 hover:bg-gray-700">
                      <Menu className="h-6 w-6" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white">Workspace</h1>
                  </div>
                  <Button onClick={toggleWhiteboardMode} variant="outline" className="flex items-center bg-gray-700 text-white hover:bg-gray-600">
                    {isWhiteboardMode ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Exit Whiteboard 
                      </>
                    ) : (
                      <>
                        <PenTool className="mr-2 h-4 w-4" />
                        Enter Whiteboard
                      </>
                    )}
                  </Button>
                </header>
                <main className="flex-1 flex overflow-hidden relative">
                  <div className="flex-1 overflow-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={params?.documentid || 'main'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full w-full"
                      >
                        {isWhiteboardMode ? (
                          <Whiteboard
                            documentId={params?.documentid}
                            data={whiteboardData}
                            onUpdate={handleWhiteboardUpdate}
                          />
                        ) : (
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
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {params?.documentid && !isWhiteboardMode && isCommentSidebarOpen && (
                      <motion.div 
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ duration: 0.3 }}
                        className="w-80 border-l border-gray-700 bg-gray-800"
                      >
                        <CommentSidebar 
                          currentUser={user}
                          getUsersFromFirestore={getUsersFromFirestore}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isChangingDocument && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                      <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                    </div>
                  )}
                </main>
              </div>
            </div>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default WorkspaceLayout;