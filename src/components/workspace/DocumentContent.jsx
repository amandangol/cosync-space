import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import EditorJS from '@editorjs/editorjs';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig'; // Adjust according to your Firebase config
import Checklist from '@editorjs/checklist';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import SimpleImage from 'simple-image-editorjs';
import { Button } from '@/components/ui/button'; // Adjust according to your button component
import { Save, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import GenerateAITemplate from './GenerateAITemplate'; // Adjust according to your AI generation component

const DocumentContent = ({ params, updateDocument }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [lastModified, setLastModified] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const isFetchedRef = useRef(false);
  const { user } = useUser();

  const saveDocument = useCallback(async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    const outputData = await editorRef.current.save();
    const documentRef = doc(db, 'documentOutput', params?.documentid);
    const now = new Date().toISOString();
    await updateDoc(documentRef, {
      output: JSON.stringify(outputData),
      content: outputData,
      lastModified: now,
      modifiedBy: user?.primaryEmailAddress?.emailAddress,
    });
    updateDocument('lastModified', now);
    updateDocument('content', outputData);
    setIsSaving(false);
  }, [params?.documentid, user?.primaryEmailAddress?.emailAddress, updateDocument]);

  const fetchDocumentOutput = useCallback(() => {
    const documentRef = doc(db, 'documentOutput', params?.documentid);
    return onSnapshot(documentRef, (doc) => {
      const { output, content, lastModified: lastModifiedFromDB, modifiedBy } = doc.data() || {};
      if (!output && !content) return;
      try {
        const parsedOutput = output ? JSON.parse(output) : content;
        const isNewEdit = modifiedBy !== user?.primaryEmailAddress?.emailAddress;
        if (isNewEdit || !isFetchedRef.current) {
          editorRef.current?.render(parsedOutput);
          isFetchedRef.current = true;
        }
        if (lastModifiedFromDB) {
          setLastModified(lastModifiedFromDB);
          updateDocument('lastModified', lastModifiedFromDB);
        }
        updateDocument('content', parsedOutput);
      } catch (error) {
        console.error('Error parsing document output:', error);
      }
    });
  }, [params?.documentid, user?.primaryEmailAddress?.emailAddress, updateDocument]);

  const initializeEditor = useCallback(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        onChange: () => {
          clearTimeout(editor.saveTimeout);
          editor.saveTimeout = setTimeout(saveDocument, 1000);
        },
        onReady: () => {
          setIsEditorReady(true);
          fetchDocumentOutput();
        },
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph: Paragraph,
          table: Table,
          list: List,
          checklist: Checklist,
          image: SimpleImage,
          code: CodeTool,
        },
        autofocus: true,
        placeholder: 'Enter text here...',
      });
      editorRef.current = editor;
    }
  }, [fetchDocumentOutput, saveDocument]);

  useEffect(() => {
    if (user && !isEditorReady && params?.documentid) {
      initializeEditor();
    }
  }, [user, isEditorReady, params?.documentid, initializeEditor]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const handleGenerateAIOutput = (output) => {
    if (editorRef.current) {
      editorRef.current.render(output);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full w-full overflow-hidden bg-white-800"
      style={{ height: 'calc(100vh - 64px)' }} 
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center p-4 border-b border-gray-700 bg-white-900"
      >
        <div className="flex items-center space-x-4">
          <Button 
            onClick={saveDocument} 
            size="sm" 
            variant="outline" 
            className={`bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <GenerateAITemplate setGenerateAIOutput={handleGenerateAIOutput} />
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          Last modified: {formatDate(lastModified)}
        </div>
      </motion.div>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-grow overflow-auto bg-white"
      >
        <div 
          id="editorjs" 
          className="editor-wrapper p-8 text-black h-full w-full max-w-none"
        />
      </motion.div>
    </motion.div>
  );
};

export default DocumentContent;