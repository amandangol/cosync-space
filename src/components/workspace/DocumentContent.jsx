import React, { useEffect, useRef, useState } from 'react';
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


const DocumentContent = ({ params, documentInfo, updateDocument }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const editorRef = useRef(null);
  const isFetchedRef = useRef(false);
  const { user } = useUser();

  useEffect(() => {
    if (user && !isEditorReady && params?.documentid) {
      initializeEditor();
    }
  }, [user, isEditorReady, params?.documentid]);
  useEffect(() => {
    if (lastSaved) {
      updateDocument('lastEdited', lastSaved);
    }
  }, [lastSaved, updateDocument]);

  const saveDocument = async () => {
    if (!editorRef.current) return;
    const outputData = await editorRef.current.save();
    const documentRef = doc(db, 'documentOutput', params?.documentid);
    const now = new Date().toISOString();
    await updateDoc(documentRef, {
      output: JSON.stringify(outputData),
      editedBy: user?.primaryEmailAddress?.emailAddress,
      lastEdited: now,
    });
    setLastSaved(now);
  };

  const fetchDocumentOutput = () => {
    const documentRef = doc(db, 'documentOutput', params?.documentid);
    return onSnapshot(documentRef, (doc) => {
      const { output, editedBy, lastEdited } = doc.data() || {};
      if (!output) return;
      try {
        const parsedOutput = JSON.parse(output);
        const isNewEdit = editedBy !== user?.primaryEmailAddress?.emailAddress;
        if (isNewEdit || !isFetchedRef.current) {
          editorRef.current?.render(parsedOutput);
          isFetchedRef.current = true;
          setLastSaved(lastEdited);
        }
      } catch (error) {
        console.error('Error parsing document output:', error);
      }
    });
  };

  const initializeEditor = () => {
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
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [1, 2, 3, 4],
              defaultLevel: 3
            }
          },
          delimiter: Delimiter,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
              defaultType: 'info',
              messagePlaceholder: 'Enter alert message',
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          image: {
            class: SimpleImage,
            config: {
              placeholder: 'Paste image URL',
            },
          },
          code: {
            class: CodeTool,
            config: {
              placeholder: 'Enter code',
            },
          },
        },
        autofocus: true,
        placeholder: 'Let\'s write an awesome story!',
      });
      editorRef.current = editor;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full overflow-hidden bg-white"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center p-4 border-b bg-gray-50"
      >
        <div className="flex items-center space-x-4">
          <Button onClick={saveDocument} size="sm" variant="outline" className="bg-white hover:bg-gray-100">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <AnimatePresence>
            {lastSaved && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-sm text-gray-500 flex items-center"
              >
                <Clock className="w-4 h-4 mr-1" />
                Last saved: {new Date(lastSaved).toLocaleString()}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-grow overflow-auto"
      >
        <div id="editorjs" className="editor-wrapper min-h-full p-8" />
      </motion.div>
    </motion.div>
  );
};

export default DocumentContent;