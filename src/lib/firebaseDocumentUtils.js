import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const MAX_DOCUMENTS_COUNT = parseInt(process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT) || 8;

export const getDocumentList = (workspaceId, setDocuments, setLoading) => {
  if (!workspaceId) {
    console.error('WorkspaceID is required');
    toast.error('Workspace ID is required');
    return () => {};
  }

  const q = query(
    collection(db, 'documents'),
    where('workspaceID', '==', String(workspaceId))
  );

  const unsubscribe = onSnapshot(q, {
    next: (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(data);
    },
    error: (error) => {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    }
  });

  // Return unsubscribe function for cleanup
  return unsubscribe;
};

export const getDocument = (documentId, setDocumentInfo, setLoading) => {
  if (!documentId) {
    console.error('DocumentID is required');
    toast.error('Document ID is required');
    return () => {};
  }

  const docRef = doc(db, 'documents', documentId);
  const unsubscribe = onSnapshot(docRef, {
    next: (docSnap) => {
      if (docSnap.exists()) {
        setDocumentInfo(docSnap.data());
      } else {
        console.error('Document does not exist');
        toast.error('Document not found');
      }
    },
    error: (error) => {
      console.error('Error fetching document:', error);
      toast.error('Failed to fetch document');
    }
  });

  // Return unsubscribe function for cleanup
  return unsubscribe;
};

export const handleCreateDocument = async (documents, params, user, router, setLoading) => {
  if (!params?.workspaceid || !user?.primaryEmailAddress?.emailAddress) {
    toast.error('Missing required information');
    return;
  }

  if (documents?.length >= MAX_DOCUMENTS_COUNT) {
    toast.error('Workspace Limit Reached', {
      description: 'You have reached the maximum number of documents allowed. Please delete some documents or create a new workspace to add more.',
    });
    return;
  }

  setLoading(true); // Set loading state to true
  try {
    const documentID = uuidv4();
    await setDoc(doc(db, 'documents', documentID), {
      id: documentID,
      workspaceID: params.workspaceid,
      owner: user.primaryEmailAddress.emailAddress,
      name: 'Untitled Document',
      cover: null,
      emoji: null,
      documentOutput: [],
    });

    await setDoc(doc(db, 'documentOutput', documentID), {
      id: documentID,
      output: [],
    });

    router.push(`/workspace/${params.workspaceid}/${documentID}`);
    toast.success('Document created successfully');
  } catch (error) {
    console.error('Error creating document:', error);
    toast.error('Failed to create document');
  } finally {
    setLoading(false); // Reset loading state
  }
};

export const handleDeleteDocument = async (docId) => {
  if (!docId) {
    toast.error('Document ID is required');
    return;
  }

  try {
    await deleteDoc(doc(db, 'documents', docId));
    await deleteDoc(doc(db, 'documentOutput', docId));
    toast.success('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
    toast.error('Failed to delete document');
  }
};

export const updateDocument = async (documentId, key, value) => {
  if (!documentId || !key) {
    toast.error('Document ID and key are required');
    return;
  }

  try {
    const docRef = doc(db, 'documents', documentId);
    await updateDoc(docRef, { [key]: value });
    // toast.success('Document updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
    toast.error('Failed to update document');
  }
};
