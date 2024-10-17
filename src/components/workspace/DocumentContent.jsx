import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import EditorJS from '@editorjs/editorjs';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import Checklist from '@editorjs/checklist';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import Alert from 'editorjs-alert';
import SimpleImage from 'simple-image-editorjs';
import { Button } from '@/components/ui/button';
import { Save, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      content: outputData, // Save the entire EditorJS output
      lastModified: now,
      modifiedBy: user?.primaryEmailAddress?.emailAddress,
    });
    updateDocument('lastModified', now);
    updateDocument('content', outputData); // Update the content in the parent component
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
        updateDocument('content', parsedOutput); // Update the content in the parent component
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
          alert: Alert,
          table: Table,
          list: List,
          checklist: Checklist,
          image: SimpleImage,
          code: CodeTool,
        },
        autofocus: true,
        placeholder: 'Let\'s write an awesome story!',
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full overflow-hidden bg-gray-50"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center p-4 border-b border-gray-200 bg-white"
      >
        <div className="flex items-center space-x-4">
          <Button 
            onClick={saveDocument} 
            size="sm" 
            variant="outline" 
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 transition-colors duration-200"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          {/* <AnimatePresence mode="wait">
            {lastModified && (
              <motion.span 
                key={lastModified}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-sm text-gray-600 flex items-center"
              >
                <Clock className="w-4 h-4 mr-1" />
                Last modified: {formatDate(lastModified)}
              </motion.span>
            )}
          </AnimatePresence> */}
        </div>
      </motion.div>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-grow overflow-auto bg-white"
      >
        <div id="editorjs" className="editor-wrapper min-h-full p-8" />
      </motion.div>
    </motion.div>
  );
};

export default DocumentContent;