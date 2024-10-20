import { useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export const useSyncUserData = () => {
  const { user } = useUser();

  const saveUserData = useCallback(async () => {
    if (!user) return;

    const docId = user.primaryEmailAddress?.emailAddress;
    try {
      await setDoc(doc(db, 'users', docId), {
        name: user.fullName,
        avatar: user.imageUrl,
        email: user.primaryEmailAddress?.emailAddress,
      }, { merge: true });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }, [user]);

  useEffect(() => {
    saveUserData();
  }, [saveUserData]);
};