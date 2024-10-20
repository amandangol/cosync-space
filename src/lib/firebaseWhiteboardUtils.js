import { doc, onSnapshot, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { toast } from 'sonner';

export const getWhiteboardData = (documentId, setWhiteboardData, setLoading) => {
  if (!documentId) {
    console.error('DocumentID is required');
    toast.error('Document ID is required');
    return () => {};
  }

  setLoading(true);
  const whiteboardRef = doc(db, 'whiteboards', documentId);
  const unsubscribe = onSnapshot(whiteboardRef, {
    next: (docSnap) => {
      if (docSnap.exists()) {
        setWhiteboardData(docSnap.data());
      } else {
        setWhiteboardData(null);
      }
      setLoading(false);
    },
    error: (error) => {
      console.error('Error fetching whiteboard data:', error);
      toast.error('Failed to fetch whiteboard data');
      setLoading(false);
    }
  });

  return unsubscribe;
};

export const createWhiteboard = async (documentId) => {
  if (!documentId) {
    toast.error('Document ID is required');
    return;
  }

  try {
    await setDoc(doc(db, 'whiteboards', documentId), {
      shapes: [],
      lastModified: new Date().toISOString(),
    });
    console.log('Whiteboard created successfully');
  } catch (error) {
    console.error('Error creating whiteboard:', error);
    toast.error('Failed to create whiteboard');
  }
};

export const updateWhiteboardData = async (documentId, newData) => {
  if (!documentId) {
    toast.error('Document ID is required');
    return;
  }

  try {
    const whiteboardRef = doc(db, 'whiteboards', documentId);
    
    // Check if the document exists
    const docSnap = await getDoc(whiteboardRef);
    
    if (!docSnap.exists()) {
      // If the document doesn't exist, create it
      await setDoc(whiteboardRef, {
        shapes: [],
        ...newData,
        lastModified: new Date().toISOString(),
      });
      console.log('Whiteboard document created and updated');
    } else {
      // If the document exists, update it
      await updateDoc(whiteboardRef, {
        ...newData,
        lastModified: new Date().toISOString(),
      });
      console.log('Whiteboard document updated');
    }
    
    // toast.success('Whiteboard updated successfully');
  } catch (error) {
    console.error('Error updating whiteboard:', error);
    toast.error('Failed to update whiteboard');
  }
};

export const deleteWhiteboard = async (documentId) => {
  if (!documentId) {
    toast.error('Document ID is required');
    return;
  }

  try {
    await deleteDoc(doc(db, 'whiteboards', documentId));
    console.log('Whiteboard deleted successfully');
  } catch (error) {
    console.error('Error deleting whiteboard:', error);
    toast.error('Failed to delete whiteboard');
  }
};