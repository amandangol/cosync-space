import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, FileText, Share2, Download, Trash2, Edit, ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentContent from './DocumentContent';
import CoverModal from '../CoverModal';
import { EmojiSelector } from '@components/EmojiSelector';
import { Tooltip } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Main = ({ params, documentInfo, updateDocument, documents, handleCreateDocument, handleDeleteDocument, user, router }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(documentInfo?.name || "Untitled Document");

  const handleRename = () => {
    setIsEditing(true);
    setEditedName(documentInfo?.name || "Untitled Document");
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleNameSubmit = () => {
    updateDocument('name', editedName);
    setIsEditing(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedName(documentInfo?.name || "Untitled Document");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      toast.error('Failed to copy link');
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Never' : date.toLocaleString();
  };

  const handleDownload = async () => {
    if (!documentInfo) return;
    // TODO: Implement .docx conversion logic here
    // For now, we'll just download the JSON as before
    const content = JSON.stringify(documentInfo, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentInfo.name || 'document'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!params?.documentid) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-full items-center justify-center p-6 bg-gray-50"
      >
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2 text-gray-800"
          >
            Welcome to Your Workspace
          </motion.h2>
          <motion.p 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600"
          >
            Get started by creating a new document or selecting an existing one.
          </motion.p>
        </div>
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            onClick={handleCreateDocument}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg transition-transform duration-200 transform hover:scale-105"
          >
            <PlusCircle className="mr-2" />
            Create New Document
          </Button>
          {documents.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center mt-8 w-full max-w-5xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                Recent Documents:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {documents.slice(0, 6).map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Button
                      variant="outline"
                      className="w-full flex flex-col items-start justify-start p-6 h-auto hover:bg-gray-50 hover:shadow-lg transition-all duration-300 rounded-lg border border-gray-200"
                      onClick={() =>
                        router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)
                      }
                    >
                      <div className="flex items-center justify-between w-full mb-4">
                        <span className="text-3xl">{doc.emoji || "📄"}</span>
                        <FileText className="text-gray-400" size={20} />
                      </div>
                      <span className="font-medium text-lg text-gray-800">
                        {doc.name || "Untitled Document"}
                      </span>
                      <span className="text-sm text-gray-500 mt-2">
                      Last edited: {formatDate(doc.lastEdited)}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative h-32 w-full overflow-hidden"
        >
          <Image
            src={documentInfo?.cover || "/images/default-cover.jpg"}
            alt="Document cover"
            layout="fill"
            objectFit="cover"
          />
          <CoverModal setNewCover={cover => updateDocument('cover', cover)}>
            <Button variant="ghost" className="absolute bottom-2 right-2 bg-white/80 hover:bg-white rounded-md">
              Change Cover
            </Button>
          </CoverModal>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between px-6 py-2 border-b border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <EmojiSelector
              setEmojiIcon={emoji => updateDocument('emoji', emoji)}
              emojiIcon={documentInfo?.emoji || "📄"}
            />
            <AnimatePresence>
              {isEditing ? (
                <motion.input
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  type="text"
                  value={editedName}
                  onChange={handleNameChange}
                  onBlur={handleNameSubmit}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                  className="text-2xl font-bold outline-none bg-gray-100 px-2 py-1 rounded-md"
                />
              ) : (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition-colors duration-200"
                  onClick={handleRename}
                >
                  {documentInfo?.name || "Untitled Document"}
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip content="Share">
              <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-blue-50 text-blue-600 rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip content="Download">
              <Button variant="ghost" size="icon" onClick={handleDownload} className="hover:bg-blue-50 text-blue-600 rounded-full">
                <Download className="h-5 w-5" />
              </Button>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-blue-50 text-blue-600 rounded-full">
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-grow overflow-auto"
      >
        <div className="max-w-4xl mx-auto my-8 p-8 bg-white shadow-lg rounded-lg">
          <DocumentContent
            params={params}
            documentInfo={documentInfo}
            user={user}
            updateDocument={updateDocument}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}


export default Main;