import { useRouter } from 'next/navigation'
import { deleteDoc, doc } from 'firebase/firestore'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'

import { db } from '@config/firebaseConfig'

import DocumentOptions from './DocumentOptions'

const List = ({ params, documents }) => {
  const router = useRouter()

  const handleDeleteDocument = async docId => {
    await deleteDoc(doc(db, 'documents', docId))
    toast('Document Deleted!')
  }

  const handleClick = docId => {
    router.push(`/workspace/${params?.workspaceid}/${docId}`)
  }

  return (
    <>
      {documents.map(doc => (
        <div
          key={doc?.id}
          tabIndex={0}
          onClick={() => handleClick(doc?.id)}
          className={`mt-3 flex cursor-pointer items-center justify-between rounded-lg p-2 px-3 hover:bg-primary/10 ${doc?.id === params?.documentid && 'bg-gray-100'} `}
        >
          <div className="flex items-center gap-2">
            {!doc.emoji && <FileText className="text-primary" size={20} />}
            <h4 className="flex gap-2">
              {doc.emoji} {doc.name}
            </h4>
          </div>
          <DocumentOptions doc={doc} deleteDocument={handleDeleteDocument} />
        </div>
      ))}
    </>
  )
}

export default List
