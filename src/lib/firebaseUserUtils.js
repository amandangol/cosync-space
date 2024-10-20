import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export const getUsersFromFirestore = async (userIds) => {
  console.log('getUsersFromFirestore called with IDs:', userIds);
  
  if (!userIds || userIds.length === 0) {
    console.log('No user IDs provided. Returning empty array.');
    return [];
  }

  const usersQuery = query(collection(db, 'users'), where('email', 'in', userIds));
  const snapshot = await getDocs(usersQuery);

  const users = snapshot.docs.map(doc => {
    const userData = doc.data();
    console.log('Raw user data from Firestore:', userData);
    return {
      id: userData.email,
      name: userData.name || userData.email.split('@')[0],
      avatar: userData.avatar || null,
    };
  });

  console.log('Processed user data:', users);
  return users;
};

export const getMentionSuggestions = async (text) => {
  console.log('getMentionSuggestions called with text:', text);
  const q = query(collection(db, 'users'), where('email', '!=', null));
  const querySnapshot = await getDocs(q);
  let userList = querySnapshot.docs.map(doc => {
    const userData = doc.data();
    return {
      id: userData.email,
      name: userData.name || userData.email.split('@')[0],
      avatar: userData.avatar || null,
    };
  });

  if (text) {
    userList = userList.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
  }

  console.log('Mention suggestions:', userList);
  return userList;
};

export const getCurrentUser = async (userEmail) => {
  console.log('getCurrentUser called with email:', userEmail);
  if (!userEmail) {
    console.log('No user email provided to getCurrentUser');
    return null;
  }
  
  const q = query(collection(db, 'users'), where('email', '==', userEmail));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    console.log('No user found in Firestore for email:', userEmail);
    return null;
  }

  const userData = querySnapshot.docs[0].data();
  const user = {
    id: userData.email,
    name: userData.name || userData.email.split('@')[0],
    avatar: userData.avatar || null,
  };
  console.log('User found in Firestore:', user);
  return user;
};