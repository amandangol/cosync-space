import React from 'react';
import { motion } from 'framer-motion';
import WorkspaceItem from './WorkspaceItem';

const WorkspaceList = ({ filteredList, layout, sortBy, setWorkspaceToDelete, setIsDeleteModalOpen, router }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className={layout === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}>
      {filteredList
        .sort((a, b) => {
          if (sortBy === 'name') return a.name.localeCompare(b.name);
          if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        })
        .map((workspace) => (
          <WorkspaceItem
            key={workspace.id}
            workspace={workspace}
            layout={layout}
            setWorkspaceToDelete={setWorkspaceToDelete}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            router={router}
          />
        ))}
    </div>
  </motion.div>
);

export default WorkspaceList;