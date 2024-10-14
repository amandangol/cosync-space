// lib/userUtils.js
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'

export const getUsersFromFirestore = async (userIds) => {
  console.log('Fetching users for IDs:', userIds)
  const q = query(collection(db, 'users'), where('email', 'in', userIds))
  const querySnapshot = await getDocs(q)
  const users = querySnapshot.docs.map(doc => {
    const userData = doc.data()
    console.log('Raw user data:', userData)
    return {
      id: userData.email, // Use email as the id
      name: userData.name || userData.email.split('@')[0],
      avatar: userData.avatar || null,
    }
  })
  console.log('Processed user data:', users)
  return users
}

export const getMentionSuggestions = async (text) => {
  const q = query(collection(db, 'users'), where('email', '!=', null))
  const querySnapshot = await getDocs(q)
  let userList = querySnapshot.docs.map(doc => {
    const userData = doc.data()
    return {
      id: userData.email, // Use email as the id
      name: userData.name || userData.email.split('@')[0],
      avatar: userData.avatar || null,
    }
  })

  if (text) {
    userList = userList.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase())
    )
  }

  console.log('Mention suggestions:', userList)
  return userList
}