    import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
    import { db } from '@/config/firebaseConfig'
    import { toast } from 'sonner'
    import { v4 as uuidv4 } from 'uuid'

    export const getDocumentList = (workspaceId, setDocuments) => {
    const q = query(
        collection(db, 'documents'),
        where('workspaceID', '==', String(workspaceId))
    )

    return onSnapshot(q, snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setDocuments(data)
    })
    }

    export const getDocument = (documentId, setDocumentInfo) => {
    const docRef = doc(db, 'documents', documentId)
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
        setDocumentInfo(docSnap.data())
        }
    })
    }

    export const handleCreateDocument = async (documents, params, user, router, setLoading) => {
    const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 5

    if (documents?.length >= MAX_DOCUMENTS_COUNT) {
        toast('Upgrade required', {
        description: 'You have reached the maximum number of files. Upgrade your plan to create more documents.',
        action: {
            label: 'Upgrade',
            onClick: () => console.log('Upgrade clicked'),
        },
        })
        return
    }

    setLoading(true)

    const documentID = uuidv4()
    await setDoc(doc(db, 'documents', documentID), {
        id: documentID,
        workspaceID: params?.workspaceid,
        owner: user?.primaryEmailAddress?.emailAddress,
        name: 'Untitled Document',
        cover: null,
        emoji: null,
        content: '',
    })

    router.push(`/workspace/${params?.workspaceid}/${documentID}`)
    setLoading(false)
    }

    export const handleDeleteDocument = async (docId) => {
    await deleteDoc(doc(db, 'documents', docId))
    toast('Document Deleted!')
    }

    export const updateDocument = async (documentId, key, value) => {
    try {
    const docRef = doc(db, 'documents', documentId)
    await updateDoc(docRef, { [key]: value })
    } catch (error) {
    console.error('Error updating document:', error)
    toast.error('Failed to update document')
    }
    }