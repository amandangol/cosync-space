import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, FileText, Share2, Download, Edit, ChevronDown, Clock, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentContent from './DocumentContent';
import Whiteboard from './Whiteboard';
import UpdateCoverPhoto from '../UpdateCoverPhoto';
import { EmojiSelector } from '@/components/EmojiSelector';
import { Tooltip } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { getDocument, updateDocument } from '@/lib/firebaseDocumentUtils';
import { getWhiteboardData, updateWhiteboardData } from '@/lib/firebaseWhiteboardUtils';

const Main = ({ params, documents, handleCreateDocument, handleDeleteDocument, user, router }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("Untitled Document");
  const [lastModified, setLastModified] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [whiteboardData, setWhiteboardData] = useState(null);
  const [isWhiteboardMode, setIsWhiteboardMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coverPhoto, setCoverPhoto] = useState("/images/default-cover.png");

  const whiteboardRef = useRef(null);

  useEffect(() => {
    let unsubscribeDoc = () => {};
    let unsubscribeWhiteboard = () => {};

    if (params?.documentid) {
      unsubscribeDoc = getDocument(params.documentid, (doc) => {
        setDocumentInfo(doc);
        setEditedName(doc?.name || "Untitled Document");
        setLastModified(doc?.lastModified || null);
        setCoverPhoto(doc?.cover || "/images/default-cover.png");
        setIsLoading(false);
      });
      unsubscribeWhiteboard = getWhiteboardData(params.documentid, setWhiteboardData, () => {});
    } else {
      setDocumentInfo(null);
      setWhiteboardData(null);
      setIsLoading(false);
    }

    return () => {
      unsubscribeDoc();
      unsubscribeWhiteboard();
    };
  }, [params?.documentid]);

  const handleUpdateEmoji = (newEmoji) => {
    if (params?.documentid) {
      updateDocument(params.documentid, 'emoji', newEmoji);
    }
  };

  const handleRename = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleNameSubmit = () => {
    updateDocument(params?.documentid, 'name', editedName);
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

  const toggleWhiteboardMode = () => {
    setIsWhiteboardMode(!isWhiteboardMode);
  };


  const convertEditorJSToDocx = (content) => {
    if (!content || !content.blocks) {
      throw new Error('Invalid document content structure');
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: content.blocks.map(block => {
          switch (block.type) {
            case 'header':
              return new Paragraph({
                text: block.data.text,
                heading: `Heading${block.data.level}`
              });
            case 'paragraph':
              return new Paragraph({
                children: [new TextRun(block.data.text)]
              });
            case 'list':
              return new Paragraph({
                text: block.data.items.join('\n'),
                bullet: {
                  level: 0
                }
              });
            default:
              return new Paragraph({
                text: JSON.stringify(block.data)
              });
          }
        })
      }]
    });
    return doc;
  };

  const handleDownload = async () => {
    try {
      if (isWhiteboardMode && whiteboardRef.current) {
        // Download whiteboard content as PNG
        const canvas = whiteboardRef.current.querySelector('canvas');
        if (canvas) {
          // Convert the canvas content to a data URL
          const pngUrl = canvas.toDataURL('image/png');
  
          // Create a download link
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `${documentInfo.name || 'whiteboard'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
          toast.success('Whiteboard image downloaded successfully!');
        } else {
          toast.error('No whiteboard content found');
        }
      } else {
        // Download document content (existing logic)
        const content = documentInfo.content;
        if (!content) {
          throw new Error('No document content found');
        }
  
        // Convert the content to a DOCX document
        const docx = convertEditorJSToDocx(content);
        const blob = await Packer.toBlob(docx);
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${documentInfo.name || 'document'}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        toast.success('Document downloaded successfully!');
      }
    } catch (error) {
      console.error('Error downloading content:', error);
      toast.error(`Failed to download content: ${error.message}`);
    }
  };
  
  
  const handleUpdateCoverPhoto = (newCover) => {
    updateDocument(params?.documentid, 'cover', newCover);
    setCoverPhoto(newCover);
  };
  
  if (!params?.documentid) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-full items-center justify-center p-6 bg-gray-800"
      >
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2 text-white"
          >
            Welcome to Your Workspace
          </motion.h2>
          <motion.p 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300"
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
              <h3 className="text-2xl font-semibold mb-4 text-gray-200">
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
                      className="bg-gray-900 w-full flex flex-col items-start justify-start p-6 h-auto hover:bg-gray-700 hover:shadow-lg transition-all duration-300 rounded-lg border border-gray-600 text-left"
                      onClick={() =>
                        router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)
                      }
                    > 
                      <div className="flex items-center justify-between w-full mb-4">
                        <span className="text-3xl">{doc.emoji || "📄"}</span>
                        <FileText className="text-gray-400" size={20} />
                      </div>
                      <span className="font-medium text-lg text-gray-200">
                        {doc.name || "Untitled Document"}
                      </span>
                      <span className="text-sm text-gray-400 mt-2 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Last edited: {formatDate(doc.lastModified)}
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
      className="flex flex-col h-full bg-gray-800"
    >
      <div className="sticky top-0 z-10 bg-gray-900 shadow-sm">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative h-40 overflow-hidden"
        >
         <Image
  src={`${coverPhoto}?v=${Date.now()}`}
  alt="Document cover"
  layout="fill"
  objectFit="cover"
  unoptimized
/>
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-between p-4">
           
            <UpdateCoverPhoto setNewCover={handleUpdateCoverPhoto}>
              <Button variant="ghost" className="bg-gray-800/80 hover:bg-gray-700 text-white rounded-md hover:text-white">
                Change Cover
              </Button>
            </UpdateCoverPhoto>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between px-6 py-2 border-b border-gray-700"
        >
         <div className="flex items-center space-x-4">
          <EmojiSelector
            setEmojiIcon={handleUpdateEmoji}
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
                  className="text-2xl font-bold outline-none bg-gray-700 text-white px-2 py-1 rounded-md"
                />
              ) : (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold cursor-pointer hover:bg-gray-700 text-white px-2 py-1 rounded-md transition-colors duration-200"
                  onClick={handleRename}
                >
                  {documentInfo?.name || "Untitled Document"}
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip content="Share">
              <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-white text-blue-400 rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip content={`Download ${isWhiteboardMode ? 'Whiteboard' : 'Document'}`}>
              <Button variant="ghost" size="icon" onClick={handleDownload} className="hover:bg-white text-blue-400 rounded-full">
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
            <Button onClick={toggleWhiteboardMode} variant="outline" className="flex items-center bg-gray-700 text-white hover:bg-gray-600 hover:text-blue">
              <Columns className="mr-2 h-4 w-4" />
              {isWhiteboardMode ? 'Switch to Document' : 'Switch to Whiteboard'}
            </Button>
          </div>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-grow overflow-auto w-full"
      >
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : isWhiteboardMode ? (
            <div className="whiteboard-container w-full h-full" ref={whiteboardRef}>
              <Whiteboard
                documentId={params?.documentid}
                data={whiteboardData}
                onUpdate={(newData) => updateWhiteboardData(params?.documentid, newData)}
              />
            </div>
          ) : (
            <div className="document-content-container w-full px-4 sm:px-6 lg:px-8">
              <DocumentContent
                params={params}
                documentInfo={documentInfo}
                user={user}
                updateDocument={(key, value) => updateDocument(params?.documentid, key, value)}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Main;