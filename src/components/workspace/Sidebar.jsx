import React from 'react';
import { Bell, Loader, FileText, MoreVertical, Search, FolderPlus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const MAX_DOCUMENTS_COUNT = process.env.NEXT_PUBLIC_MAX_DOCUMENTS_COUNT || 5;

const Sidebar = ({ documents, loading, params, handleCreateDocument, handleDeleteDocument, router }) => {
  return (
    <aside className="w-64 bg-gray-50 text-gray-800 p-6">
      <div className="flex items-center justify-between border-b border-gray-300 pb-5">
        <h1 className="text-xl font-bold">DocuMentor</h1>
      </div>
      <div className="mt-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-8 pr-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Workspace</h2>
        <Button onClick={handleCreateDocument} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : <FolderPlus size={16} />}
        </Button>
      </div>
      <nav className="mt-6 space-y-2">
        {documents.map(doc => (
          <div
            key={doc?.id}
            onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
            className={`flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200 ${
              doc?.id === params?.documentid ? 'bg-blue-100' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              {doc.emoji || <FileText className="text-gray-600" size={20} />}
              <span className="truncate">{doc.name}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical size={16} className="text-gray-600" />
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
        <Button variant="outline" size="sm" className="mt-2 w-full border-gray-300 text-gray-800 hover:bg-gray-100">
          <Settings size={16} className="mr-2" />
          Upgrade Plan
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
