// lib/userUtils.js
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'

export const getUsersFromFirestore = async (userIds) => {
  const q = query(collection(db, 'users'), where('email', 'in', userIds))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data())
}

export const getMentionSuggestions = async (text) => {
  const q = query(collection(db, 'users'), where('email', '!=', null))
  const querySnapshot = await getDocs(q)
  let userList = querySnapshot.docs.map(doc => doc.data())

  if (text) {
    userList = userList.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase())
    )
  }

  return userList.map(user => user.email)
}