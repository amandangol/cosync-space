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

const DocumentContent = ({ params }) => {
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

  const saveDocument = async () => {
    if (!editorRef.current) return;
    const outputData = await editorRef.current.save();
    const documentRef = doc(db, 'documentOutput', params?.documentid);
    await updateDoc(documentRef, {
      output: JSON.stringify(outputData),
      editedBy: user?.primaryEmailAddress?.emailAddress,
      lastEdited: new Date().toISOString(),
    });
    setLastSaved(new Date().toLocaleTimeString());
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
          setLastSaved(new Date(lastEdited).toLocaleTimeString());
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
          // Debounce the save operation
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <Button onClick={saveDocument} size="sm" variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          {lastSaved && (
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Last saved at {lastSaved}
            </span>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <div id="editorjs" className="editor-wrapper min-h-full p-8" />
      </div>
    </div>
  );
};

export default DocumentContent;