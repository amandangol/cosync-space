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
    <DialogContent className="bg-gray-800 text-white sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-400">
          <Trash2 className="h-5 w-5" />
          Delete Workspace
        </DialogTitle>
        <DialogDescription className="text-gray-300">
          Are you sure you want to delete the workspace "{workspaceToDelete?.name}"? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="sm:justify-start">
        <Button variant="outline" onClick={() => setIsOpen(false)} className=" bg-black-600 text-white border-gray-600 hover:bg-gray-700 text-white">
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => handleDelete(workspaceToDelete?.id)} className="bg-red-600 text-white hover:bg-red-700">
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteWorkspaceModal;