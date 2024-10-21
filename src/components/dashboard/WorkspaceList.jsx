import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkspaceItem from '@components/dashboard/WorkspaceItem';
import RenameWorkspaceModal from '@components/dashboard/RenameWorkspaceModel';

const WorkspaceList = ({ 
  filteredList, 
  layout, 
  sortBy, 
  setWorkspaceToDelete, 
  setIsDeleteModalOpen, 
  router,
  onRenameWorkspace 
}) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [workspaceBeingRenamed, setWorkspaceBeingRenamed] = useState(null);

  const handleRename = (workspace) => {
    setWorkspaceBeingRenamed(workspace);
    setIsRenameModalOpen(true);
  };

  const handleRenameSubmit = (newName) => {
    if (onRenameWorkspace && workspaceBeingRenamed) {
      onRenameWorkspace(workspaceBeingRenamed.id, newName);
    }
    setIsRenameModalOpen(false);
    setWorkspaceBeingRenamed(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'lastUpdated':
        default:
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
    });
  }, [filteredList, sortBy]);

  return (
    <>
      <motion.div
        key={layout}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={layout === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'space-y-4'}
      >
        {sortedList.map((workspace) => (
          <motion.div
            key={workspace.id}
            variants={itemVariants}
            layout
          >
            <WorkspaceItem
              workspace={workspace}
              layout={layout}
              setWorkspaceToDelete={setWorkspaceToDelete}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              router={router}
              onRename={() => handleRename(workspace)}
            />
          </motion.div>
        ))}
      </motion.div>
      {workspaceBeingRenamed && (
        <RenameWorkspaceModal
          isOpen={isRenameModalOpen}
          setIsOpen={setIsRenameModalOpen}
          workspace={workspaceBeingRenamed}
          onRename={handleRenameSubmit}
        />
      )}
    </>
  );
};

export default React.memo(WorkspaceList);