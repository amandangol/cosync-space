import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import EditorJS from '@editorjs/editorjs'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'
import CoverModal from '@/components/CoverModal'
import Checklist from '@editorjs/checklist'
import CodeTool from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Paragraph from '@editorjs/paragraph'
import Table from '@editorjs/table'
import Alert from 'editorjs-alert'
import SimpleImage from 'simple-image-editorjs'


const DocumentContent = ({ params, documentInfo, user, updateDocument }) => {
  const [isEditorReady, setIsEditorReady] = useState(false)
  const editorRef = useRef(null)

  useEffect(() => {
    if (user && !isEditorReady && params?.documentid) {
      initializeEditor()
    }
  }, [user, isEditorReady, params?.documentid])

  const initializeEditor = () => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        onChange: async () => {
          const outputData = await editor.save()
          const documentRef = doc(db, 'documentOutput', params?.documentid)
          await updateDoc(documentRef, {
            output: JSON.stringify(outputData),
            editedBy: user?.primaryEmailAddress?.emailAddress,
          })
        },
        onReady: () => {
          setIsEditorReady(true)
          fetchDocumentOutput()
        },
        tools: {
            header: Header,
            delimiter: Delimiter,
            paragraph: Paragraph,
            alert: {
              class: Alert,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+A',
              config: {
                alertTypes: [
                  'primary',
                  'secondary',
                  'info',
                  'success',
                  'warning',
                  'danger',
                  'light',
                  'dark',
                ],
                defaultType: 'primary',
                messagePlaceholder: 'Enter a message',
              },
            },
            table: Table,
            list: {
              class: List,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+L',
              config: {
                defaultStyle: 'unordered',
              },
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+C',
            },
            image: SimpleImage,
            code: {
              class: CodeTool,
              shortcut: 'CMD+SHIFT+P',
            },
          },
      })

      editorRef.current = editor
    }
  }

  const fetchDocumentOutput = () => {
    const documentRef = doc(db, 'documentOutput', params?.documentid)

    return onSnapshot(documentRef, doc => {
      const { output } = doc.data() || {}

      if (!output) return

      try {
        const parsedOutput = JSON.parse(output)
        editorRef.current?.render(parsedOutput)
      } catch (error) {
        console.error('Error parsing document output:', error)
      }
    })
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={documentInfo?.cover || '/images/default-cover.png'}
            alt="Document cover"
            layout="fill"
            objectFit="cover"
          />
          <CoverModal setNewCover={newCover => updateDocument('cover', newCover)}>
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center">
              <p className="text-white font-semibold">Change Cover</p>
            </div>
          </CoverModal>
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div id="editorjs" />
      </div>
    </div>
  )
}

export default DocumentContent