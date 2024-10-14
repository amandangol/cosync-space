// import React, { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';
// import Image from 'next/image';
// import { ClientSideSuspense, LiveblocksProvider, RoomProvider, useThreads } from '@liveblocks/react';
// import { Composer, Thread } from '@liveblocks/react-ui';
// import { doc, onSnapshot, updateDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
// import { Bell, Loader, FileText, MoreVertical, MessageCircle, X, Settings, User, LogOut } from 'lucide-react';
// import { toast } from 'sonner';
// import { v4 as uuidv4 } from 'uuid';
// import EditorJS from '@editorjs/editorjs';

// import { db } from '@/config/firebaseConfig';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { EmojiSelector } from '@/components/EmojiSelector';

// const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 5;

// const Document = ({ params }) => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [image, setImage] = useState('/images/cover.png');
//   const [emojiIcon, setEmojiIcon] = useState(null);
//   const [documentInfo, setDocumentInfo] = useState(null);
//   const [openComment, setOpenComment] = useState(false);
//   const [isEditorReady, setIsEditorReady] = useState(false);
//   const { user } = useUser();
//   const router = useRouter();
//   const editorRef = useRef(null);
//   const { threads } = useThreads();

//   useEffect(() => {
//     params && getDocumentList();
//     params?.documentid && getDocument();
//   }, [params]);

//   useEffect(() => {
//     if (user && !isEditorReady && params?.documentid) {
//       initializeEditor();
//     }
//   }, [user, isEditorReady, params?.documentid]);

//   const getDocumentList = () => {
//     const q = query(
//       collection(db, 'documents'),
//       where('workspaceID', '==', String(params?.workspaceid))
//     );

//     const unsubscribe = onSnapshot(q, snapshot => {
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setDocuments(data);
//     });
//   };

//   const getDocument = async () => {
//     try {
//       const docRef = doc(db, 'documents', params.documentid);
//       const unsubscribe = onSnapshot(docRef, (docSnap) => {
//         if (docSnap.exists()) {
//           const docData = docSnap.data();
//           setDocumentInfo(docData);
//           setEmojiIcon(docData.emoji);
//           docData.cover && setImage(docData.cover);
//         }
//       });
//     } catch (error) {
//       console.error('Error fetching document:', error);
//     }
//   };

//   const handleCreateDocument = async () => {
//     if (documents?.length >= MAX_DOCUMENTS_COUNT) {
//       toast('Upgrade required', {
//         description: 'You have reached the maximum number of files. Upgrade your plan to create more documents.',
//         action: {
//           label: 'Upgrade',
//           onClick: () => console.log('Upgrade clicked'),
//         },
//       });
//       return;
//     }

//     setLoading(true);

//     const documentID = uuidv4();
//     await setDoc(doc(db, 'documents', documentID), {
//       id: documentID,
//       workspaceID: params?.workspaceid,
//       owner: user?.primaryEmailAddress?.emailAddress,
//       name: 'Untitled Document',
//       cover: null,
//       emoji: null,
//       documentOutput: [],
//     });

//     await setDoc(doc(db, 'documentOutput', documentID), {
//       id: documentID,
//       output: [],
//     });

//     router.push(`/workspace/${params?.workspaceid}/${documentID}`);
//     setLoading(false);
//   };

//   const handleDeleteDocument = async docId => {
//     await deleteDoc(doc(db, 'documents', docId));
//     toast('Document Deleted!');
//   };

//   const updateDocument = async (key, value) => {
//     try {
//       const docRef = doc(db, 'documents', params.documentid);
//       await updateDoc(docRef, { [key]: value });
//     } catch (error) {
//       console.error('Error updating document:', error);
//     }
//   };

//   const initializeEditor = () => {
//     if (!editorRef.current) {
//       const editor = new EditorJS({
//         holder: 'editorjs',
//         onChange: async () => {
//           const outputData = await editor.save();
//           const documentRef = doc(db, 'documentOutput', params?.documentid);
//           await updateDoc(documentRef, {
//             output: JSON.stringify(outputData),
//             editedBy: user?.primaryEmailAddress?.emailAddress,
//           });
//         },
//         onReady: () => {
//           setIsEditorReady(true);
//           fetchDocumentOutput();
//         },
//         tools: {
//           // Add your EditorJS tools configuration here
//         },
//       });

//       editorRef.current = editor;
//     }
//   };

//   const fetchDocumentOutput = () => {
//     const documentRef = doc(db, 'documentOutput', params?.documentid);

//     return onSnapshot(documentRef, doc => {
//       const { output } = doc.data() || {};

//       if (!output) return;

//       try {
//         const parsedOutput = JSON.parse(output);
//         editorRef.current?.render(parsedOutput);
//       } catch (error) {
//         console.error('Error parsing document output:', error);
//       }
//     });
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white p-6 shadow-md">
//         <div className="flex items-center justify-between border-b pb-5">
//           <h1 className="text-xl font-bold">Documenta</h1>
//           <Bell className="text-gray-500 hover:text-gray-700 cursor-pointer" />
//         </div>
//         <div className="mt-6 flex items-center justify-between">
//           <h2 className="text-lg font-semibold">My Workspace</h2>
//           <Button onClick={handleCreateDocument} size="sm" className="text-lg">
//             {loading ? <Loader className="h-4 w-4 animate-spin" /> : '+'}
//           </Button>
//         </div>
//         <nav className="mt-6">
//           {documents.map(doc => (
//             <div
//               key={doc?.id}
//               onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
//               className={`mt-2 flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-100 ${
//                 doc?.id === params?.documentid ? 'bg-gray-200' : ''
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 {doc.emoji || <FileText className="text-gray-500" size={20} />}
//                 <span className="truncate">{doc.name}</span>
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger>
//                   <MoreVertical size={16} />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem onClick={() => handleDeleteDocument(doc?.id)}>
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           ))}
//         </nav>
//         <div className="absolute bottom-6 w-52">
//           <Progress
//             value={(documents?.length / MAX_DOCUMENTS_COUNT) * 100}
//             className="h-2 rounded-full bg-gray-200"
//           />
//           <p className="mt-2 text-sm text-gray-600">
//             {documents?.length} out of {MAX_DOCUMENTS_COUNT} files used
//           </p>
//           <p className="mt-1 text-xs text-gray-500">
//             Upgrade for unlimited access
//           </p>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 overflow-auto">
//         <header className="bg-white shadow-sm p-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <EmojiSelector
//               setEmojiIcon={emoji => {
//                 setEmojiIcon(emoji);
//                 updateDocument('emoji', emoji);
//               }}
//               emojiIcon={emojiIcon || "📄"}
//             />
//             <input
//               type="text"
//               defaultValue={documentInfo?.name}
//               onBlur={e => updateDocument('name', e.target.value)}
//               className="text-2xl font-bold outline-none"
//               placeholder="Untitled Document"
//             />
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button variant="outline">Share</Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger>
//                 <User className="text-gray-500 hover:text-gray-700 cursor-pointer" />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem>
//                   <Settings className="mr-2" size={16} />
//                   Settings
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <LogOut className="mr-2" size={16} />
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </header>
//         {params?.documentid ? (
//           <div className="p-8">
//             <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
//               <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
//                 <Image
//                   src={image}
//                   alt="Document cover"
//                   layout="fill"
//                   objectFit="cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center">
//                   <p className="text-white font-semibold">Change Cover</p>
//                 </div>
//               </div>
//             </div>
//             <div className="rounded-lg bg-white p-6 shadow-md">
//               <div id="editorjs" />
//             </div>
//           </div>
//         ) : (
//           <div className="flex h-full items-center justify-center">
//             <p className="text-xl text-gray-500">Select a document or create a new one</p>
//           </div>
//         )}
//       </main>

//       {/* Comment section */}
//       <div className="fixed bottom-6 right-6 z-10">
//         <Button
//           onClick={() => setOpenComment(!openComment)}
//           className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
//         >
//           {openComment ? <X size={24} /> : <MessageCircle size={24} />}
//         </Button>
//         {openComment && (
//           <div className="absolute bottom-16 right-0 h-[350px] w-[300px] overflow-auto rounded-lg bg-white p-4 shadow-xl">
//             {threads?.map(thread => (
//               <Thread key={thread.id} thread={thread} />
//             ))}
//             <Composer>
//               <Composer.Submit className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
//                 Reply
//               </Composer.Submit>
//             </Composer>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Document;