import React, { useState, useEffect } from 'react';
import { Loader, FileText, MoreVertical, Search, FolderPlus, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/ui/tooltip';
import { db } from '@config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';


const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 8;

const Sidebar = ({ documents = [], loading, params, handleCreateDocument, handleDeleteDocument, router, isCollapsed, toggleSidebar }) => {
  const documentCount = documents.length;
  const [workspaceName, setWorkspaceName] = useState('Loading...');

  useEffect(() => {
    if (params?.workspaceid) {
      getWorkspaceName();
    }
  }, [params]);

  const getWorkspaceName = async () => {
    try {
      const workspaceRef = doc(db, 'workspaces', String(params?.workspaceid));
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (workspaceSnap.exists()) {
        setWorkspaceName(workspaceSnap.data().name);
      } else {
        setWorkspaceName('Untitled Workspace');
      }
    } catch (error) {
      console.error('Error fetching workspace name:', error);
      setWorkspaceName('Untitled Workspace');
    }
  };

  return (
    <motion.aside 
      initial={{ width: isCollapsed ? 64 : 256, opacity: 0 }}
      animate={{ width: isCollapsed ? 64 : 256, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gray-50 text-gray-800 h-screen flex flex-col border-r border-gray-200`}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`flex items-center justify-between border-b border-gray-300 p-4 ${isCollapsed ? 'flex-col' : ''}`}
      >
        {!isCollapsed && <h1 className="text-xl font-bold truncate">{workspaceName}</h1>}
        <Tooltip content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <Button onClick={toggleSidebar} variant="ghost" size="sm">
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </Tooltip>
      </motion.div>
      <AnimatePresence>
        {isCollapsed ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center py-4 space-y-4"
          >
          <Tooltip content="Create new document">
            <Button onClick={handleCreateDocument} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <FolderPlus size={16} />}
            </Button>
          </Tooltip>
          <Tooltip content={`${documentCount} document${documentCount !== 1 ? 's' : ''}`}>
            <div className="text-sm font-medium text-gray-600">{documentCount}</div>
          </Tooltip>
          {documents.map(doc => (
            <Tooltip key={doc?.id} content={doc.name}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
                className={`w-10 h-10 flex items-center justify-center ${
                  doc?.id === params?.documentid ? 'bg-blue-100' : ''
                }`}
              >
                {doc.emoji || <FileText className="text-gray-600" size={20} />}
              </Button>
            </Tooltip>
          ))}
          </motion.div>
      ) : (
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full overflow-hidden p-4"
      >
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <Input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-8 pr-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Documents ({documentCount})</h2>
            <Button onClick={handleCreateDocument} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <FolderPlus size={16} />}
            </Button>
          </div>
          <nav className="flex-grow overflow-y-auto space-y-2 mb-4">
            {documentCount > 0 ? (
              documents.map(doc => (
                <div
                  key={doc?.id}
                  onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200 ${
                    doc?.id === params?.documentid ? 'bg-blue-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {doc.emoji || <FileText className="text-gray-600" size={20} />}
                    <span className="truncate">{doc.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical size={16} className="text-gray-600" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc?.id);
                      }}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center">No documents found</div>
            )}
          </nav>
          <div className="mt-auto">
            <Progress
              value={(documentCount / MAX_DOCUMENTS_COUNT) * 100}
              className="h-2 rounded-full bg-gray-200 mb-2"
            />
            <p className="text-sm text-gray-600 mb-2">
              {documentCount} out of {MAX_DOCUMENTS_COUNT} files used
            </p>
            <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-800 hover:bg-gray-100">
              <Settings size={16} className="mr-2" />
              Upgrade Plan
            </Button>
          </div>
          </motion.div>
      )}
            </AnimatePresence>

            </motion.aside>
  );
};

export default Sidebar;