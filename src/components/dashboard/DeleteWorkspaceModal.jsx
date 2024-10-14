import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DeleteWorkspaceModal = ({ isOpen, setIsOpen, workspaceToDelete, handleDelete }) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <Trash2 className="h-5 w-5" />
          Delete Workspace
        </DialogTitle>
        <DialogDescription className="text-gray-500">
          Are you sure you want to delete the workspace "{workspaceToDelete?.name}"? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="sm:justify-start">
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => handleDelete(workspaceToDelete?.id)}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteWorkspaceModal;