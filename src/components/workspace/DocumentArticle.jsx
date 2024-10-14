'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

import { db } from '@config/firebaseConfig'
import CoverModal from "../CoverModal"
import { EmojiSelector } from "../EmojiSelector"


const DocumentArticle = ({ params }) => {
  const [image, setImage] = useState('/images/cover.png')
  const [emojiIcon, setEmojiIcon] = useState(null)
  const [documentInfo, setDocumentInfo] = useState(null)

  useEffect(() => {
    params && getDocument()
  }, [params])

  const getDocument = async () => {
    try {
      const docRef = doc(db, 'documents', params.documentid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const docData = docSnap.data()
        setDocumentInfo(docData)
        setEmojiIcon(docData.emoji)
        docData.cover && setImage(docData.cover)
      }
    } catch (error) {
      console.error('Error fetching document:', error)
    }
  }

  const updateDocument = async (key, value) => {
    try {
      const docRef = doc(db, 'documents', params.documentid)
      await updateDoc(docRef, { [key]: value })
    } catch (error) {
      console.error('Error updating document:', error)
    }
  }

  return (
    <>
      <CoverModal
        setNewCover={image => {
          setImage(image)
          updateDocument('cover', image)
        }}
      >
        <div className="group relative cursor-pointer">
          <p className="absolute inset-0 hidden items-center justify-center rounded-t-xl bg-black/50 text-lg font-semibold text-white group-hover:flex">
            Change Cover
          </p>
          <div className="group-hover:opacity-50">
            <Image
              src={image}
              alt="Workspace cover"
              width={2000}
              height={2000}
              className="h-[200px] w-full rounded-t-xl object-cover"
            />
          </div>
        </div>
      </CoverModal>
      <div className="absolute ml-10 mt-[-1.7rem]">
        <EmojiSelector
          setEmojiIcon={emoji => {
            setEmojiIcon(emoji)
            updateDocument('emoji', emoji)
          }}
          emojiIcon={emojiIcon}
        />
      </div>
      <div className="p-10 px-20">
        <input
          type="text"
          placeholder="Untitled Document"
          defaultValue={documentInfo?.name}
          onBlur={e => updateDocument('name', e.target.value)}
          className="w-full text-2xl font-bold outline-none"
        />
      </div>
    </>
  )
}

export default DocumentArticle
