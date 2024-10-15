import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MoreVertical, Trash2, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import WorkspaceStats from './WorkspaceStats';

const WorkspaceItem = ({
  workspace,
  layout,
  setWorkspaceToDelete,
  setIsDeleteModalOpen,
  router,
  documents,
  onRename,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const ItemContent = () => (
    <>
      <div
        className="relative aspect-video cursor-pointer overflow-hidden rounded-t-lg"
        onClick={() => router.push(`/workspace/${workspace.id}`)}
      >
        <Image
          src={workspace.cover || "/images/default-cover.jpg"}
          alt={`${workspace.name} cover`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{workspace.name}</h2>
          <span className="text-2xl">{workspace.emoji}</span>
        </div>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{workspace.description}</p>
      </div>
    </>
  );

  const renderDropdownMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRename(workspace)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setWorkspaceToDelete(workspace);
            setIsDeleteModalOpen(true);
          }}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return layout === 'grid' ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
    >
      <ItemContent />
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-600 hover:text-purple-700"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
          {isExpanded ? 'Less' : 'More'}
        </Button>
        {renderDropdownMenu()}
      </div>
      {isExpanded && (
        <WorkspaceStats
          workspace={workspace}
          documents={documents || []}
          lastEdited={documents && documents.length > 0 ? documents[0].lastEdited : 'N/A'}
        />
      )}
    </motion.div>
  ) :  (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
    >
      <div className="flex cursor-pointer items-center justify-between p-4" onClick={() => router.push(`/workspace/${workspace.id}`)}>
        <div className="flex items-center space-x-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-lg">
            <Image
              src={workspace.cover || "/images/default-cover.jpg"}
              alt={`${workspace.name} cover`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{workspace.name}</h2>
            <p className="text-sm text-gray-500 line-clamp-1">{workspace.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{workspace.emoji}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-purple-600 hover:text-purple-700"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {isExpanded ? 'Less' : 'More'}
          </Button>
          {renderDropdownMenu()}
        </div>
      </div>
{isExpanded && (
  <WorkspaceStats
    workspace={workspace}
    documents={documents}
    lastEdited={documents && documents.length > 0 ? documents[0].lastEdited : 'N/A'}
    />
)}
    </motion.div>
  );
};

export default WorkspaceItem;