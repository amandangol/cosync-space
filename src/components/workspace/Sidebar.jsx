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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState(documents);

  useEffect(() => {
    if (params?.workspaceid) {
      getWorkspaceName();
    }
  }, [params]);

  useEffect(() => {
    setFilteredDocuments(
      documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [documents, searchTerm]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const sidebarVariants = {
    open: { width: 256, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { width: 64, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const contentVariants = {
    open: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.3 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.aside
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      className="bg-gray-900 text-gray-300 h-screen flex flex-col border-r border-gray-700 overflow-hidden"
    >
      <motion.div
        variants={contentVariants}
        className="flex items-center justify-between border-b border-gray-700 p-4"
      >
        {!isCollapsed && <h1 className="text-xl font-bold truncate text-gray-100">{workspaceName}</h1>}
        <Tooltip content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <Button onClick={toggleSidebar} variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800">
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </Tooltip>
      </motion.div>
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div
            key="collapsed"
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col items-center py-4 space-y-4"
          >
            <Tooltip content="Create new document">
              <Button onClick={handleCreateDocument} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <FolderPlus size={16} />}
              </Button>
            </Tooltip>
            {documents.map(doc => (
              <Tooltip key={doc?.id} content={doc.name}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
                  className={`w-10 h-10 flex items-center justify-center ${
                    doc?.id === params?.documentid ? 'bg-gray-800' : ''
                  }`}
                >
                  {doc.emoji || <FileText className="text-gray-400" size={20} />}
                </Button>
              </Tooltip>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col h-full overflow-hidden p-4"
          >
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <Input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-8 pr-4 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-200">My Documents ({documentCount})</h2>
              <Button onClick={handleCreateDocument} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <FolderPlus size={16} />}
              </Button>
            </div>
            <nav className="flex-grow overflow-y-auto space-y-2 mb-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(doc => (
                  <div
                    key={doc?.id}
                    onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-800 transition-colors duration-200 ${
                      doc?.id === params?.documentid ? 'bg-gray-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
      {doc.emoji || <FileText className="text-gray-400" size={20} />}
      <span className="truncate w-full">{doc.name}</span>
    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical size={16} className="text-gray-500" />
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
                className="h-2 rounded-full bg-gray-700 mb-2"
              />
              <p className="text-sm text-gray-400 mb-2">
                {documentCount} out of {MAX_DOCUMENTS_COUNT} files used
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default Sidebar;