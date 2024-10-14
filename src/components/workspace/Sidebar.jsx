import React from 'react'
import { Bell, Loader, FileText, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 5

const Sidebar = ({ documents, loading, params, handleCreateDocument, handleDeleteDocument, router }) => {
  return (
    <aside className="w-64 bg-white p-6 shadow-md">
      <div className="flex items-center justify-between border-b pb-5">
        <h1 className="text-xl font-bold">Documenta</h1>
        <Bell className="text-gray-500 hover:text-gray-700 cursor-pointer" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Workspace</h2>
        <Button onClick={handleCreateDocument} size="sm" className="text-lg">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : '+'}
        </Button>
      </div>
      <nav className="mt-6">
        {documents.map(doc => (
          <div
            key={doc?.id}
            onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
            className={`mt-2 flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-100 ${
              doc?.id === params?.documentid ? 'bg-gray-200' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              {doc.emoji || <FileText className="text-gray-500" size={20} />}
              <span className="truncate">{doc.name}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleDeleteDocument(doc?.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </nav>
      <div className="absolute bottom-6 w-52">
        <Progress
          value={(documents?.length / MAX_DOCUMENTS_COUNT) * 100}
          className="h-2 rounded-full bg-gray-200"
        />
        <p className="mt-2 text-sm text-gray-600">
          {documents?.length} out of {MAX_DOCUMENTS_COUNT} files used
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Upgrade for unlimited access
        </p>
      </div>
    </aside>
  )
}

export default Sidebar