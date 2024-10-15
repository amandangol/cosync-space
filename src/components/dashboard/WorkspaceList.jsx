import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={layout === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}>
        {filteredList
          .sort((a, b) => {
            switch (sortBy) {
              case 'name':
                return a.name.localeCompare(b.name);
              case 'createdAt':
                return new Date(b.createdAt) - new Date(a.createdAt);
              case 'lastUpdated':
              default:
                return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            }
          })
          .map((workspace) => (
            <WorkspaceItem
              key={workspace.id}
              workspace={workspace}
              layout={layout}
              setWorkspaceToDelete={setWorkspaceToDelete}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              router={router}
              onRename={() => handleRename(workspace)}
            />
          ))}
      </div>
      {workspaceBeingRenamed && (
        <RenameWorkspaceModal
          isOpen={isRenameModalOpen}
          setIsOpen={setIsRenameModalOpen}
          workspace={workspaceBeingRenamed}
          onRename={handleRenameSubmit}
        />
      )}
    </motion.div>
  );
};

export default WorkspaceList;