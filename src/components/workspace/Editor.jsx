// import { useEffect, useRef, useState } from 'react'
// import { useUser } from '@clerk/nextjs'
// import Checklist from '@editorjs/checklist'
// import CodeTool from '@editorjs/code'
// import Delimiter from '@editorjs/delimiter'
// import EditorJS from '@editorjs/editorjs'
// import Header from '@editorjs/header'
// import List from '@editorjs/list'
// import Paragraph from '@editorjs/paragraph'
// import Table from '@editorjs/table'
// import Alert from 'editorjs-alert'
// import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
// import SimpleImage from 'simple-image-editorjs'

// import { db } from '@config/firebaseConfig'

// const Editor = ({ params }) => {
//   const editorRef = useRef(null)
//   const isFetchedRef = useRef(false)
//   const { user } = useUser()
//   const [isEditorReady, setIsEditorReady] = useState(false)

//   useEffect(() => {
//     if (user && !isEditorReady) {
//       initializeEditor()
//     }
//   }, [user, isEditorReady])

//   const saveDocument = async () => {
//     const editor = editorRef.current
//     if (!editor) return

//     const outputData = await editor.save()
//     const documentRef = doc(db, 'documentOutput', params?.documentid)

//     await updateDoc(documentRef, {
//       output: JSON.stringify(outputData),
//       editedBy: user?.primaryEmailAddress?.emailAddress,
//     })
//   }

//   const fetchDocumentOutput = () => {
//     const documentRef = doc(db, 'documentOutput', params?.documentid)

//     return onSnapshot(documentRef, doc => {
//       const { output, editedBy } = doc.data() || {}

//       if (!output) return

//       try {
//         const parsedOutput = JSON.parse(output)
//         const isNewEdit = editedBy !== user?.primaryEmailAddress?.emailAddress

//         if (isNewEdit || !isFetchedRef.current) {
//           editorRef.current?.render(parsedOutput)
//           isFetchedRef.current = true
//         }
//       } catch (error) {
//         console.error('Error parsing document output:', error)
//       }
//     })
//   }

//   const initializeEditor = () => {
//     if (!editorRef.current) {
//       const editor = new EditorJS({
//         holder: 'editorjs',
//         onChange: saveDocument,
//         onReady: () => {
//           fetchDocumentOutput()
//           setIsEditorReady(true)
//         },
//         tools: {
//           header: Header,
//           delimiter: Delimiter,
//           paragraph: Paragraph,
//           alert: {
//             class: Alert,
//             inlineToolbar: true,
//             shortcut: 'CMD+SHIFT+A',
//             config: {
//               alertTypes: [
//                 'primary',
//                 'secondary',
//                 'info',
//                 'success',
//                 'warning',
//                 'danger',
//                 'light',
//                 'dark',
//               ],
//               defaultType: 'primary',
//               messagePlaceholder: 'Enter a message',
//             },
//           },
//           table: Table,
//           list: {
//             class: List,
//             inlineToolbar: true,
//             shortcut: 'CMD+SHIFT+L',
//             config: {
//               defaultStyle: 'unordered',
//             },
//           },
//           checklist: {
//             class: Checklist,
//             inlineToolbar: true,
//             shortcut: 'CMD+SHIFT+C',
//           },
//           image: SimpleImage,
//           code: {
//             class: CodeTool,
//             shortcut: 'CMD+SHIFT+P',
//           },
//         },
//       })

//       editorRef.current = editor
//     }
//   }

//   return (
//     <div className="mx-auto w-full max-w-screen-xl px-4">
//       <div id="editorjs" className="editor-wrapper min-h-screen w-full" />
//     </div>
//   )
// }

// export default Editor
