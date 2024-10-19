import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
          src={workspace.cover || "/images/default-cover.png"}
          alt={`${workspace.name} cover`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{workspace.name}</h2>
          <span className="text-2xl">{workspace.emoji}</span>
        </div>
        <p className="mt-2 text-sm text-gray-300 line-clamp-2">{workspace.description}</p>
      </div>
    </>
  );

  const renderDropdownMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white hover:bg-white-300" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()} className="bg-gray-800 text-white">
        <DropdownMenuItem onClick={() => onRename(workspace)} className="hover:bg-gray-700">
          <Edit className="mr-2 h-4 w-4" />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setWorkspaceToDelete(workspace);
            setIsDeleteModalOpen(true);
          }}
          className="text-red-400 hover:bg-gray-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = () => {
    router.push(`/workspace/${workspace.id}`);
  };

  const statsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  return layout === 'grid' ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all hover:shadow-xl"
    >
      <div onClick={handleItemClick}>
        <ItemContent />
      </div>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="text-indigo-400 hover:text-indigo-300"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
          {isExpanded ? 'Less' : 'More'}
        </Button>
        {renderDropdownMenu()}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={statsVariants}
            transition={{ duration: 0.3 }}
          >
            <WorkspaceStats
              workspace={workspace}
              documents={documents || []}
              lastEdited={documents && documents.length > 0 ? documents[0].lastEdited : 'N/A'}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-lg bg-gray-800 shadow-md transition-all hover:shadow-lg"
    >
      <div className="flex cursor-pointer items-center justify-between p-4" onClick={handleItemClick}>
        <div className="flex items-center space-x-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-lg">
            <Image
              src={workspace.cover || "/images/default-cover.png"}
              alt={`${workspace.name} cover`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{workspace.name}</h2>
            <p className="text-sm text-gray-300 line-clamp-1">{workspace.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{workspace.emoji}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpand}
            className="text-indigo-400 hover:text-indigo-300"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {isExpanded ? 'Less' : 'More'}
          </Button>
          {renderDropdownMenu()}
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={statsVariants}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <WorkspaceStats
              workspace={workspace}
              documents={documents}
              lastEdited={documents && documents.length > 0 ? documents[0].lastEdited : 'N/A'}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkspaceItem;