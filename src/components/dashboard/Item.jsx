'use client'

import React, { memo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MoreVertical, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import DeleteConfirmationModal from './DeleteConfirmationModal'

const Item = memo(({ workspaceList, onDelete }) => {
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null)

  const onClickRoute = (id) => router.push(`/workspace/${id}`)

  const handleDeleteClick = (workspace) => {
    setWorkspaceToDelete(workspace)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (workspaceToDelete) {
      onDelete(workspaceToDelete.id)
      setDeleteModalOpen(false)
      setWorkspaceToDelete(null)
    }
  }

  const WorkspaceCard = ({ workspace }) => (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      <div
        className="cursor-pointer"
        onClick={() => onClickRoute(workspace.id)}
        tabIndex={0}
      >
        <div className="relative h-40">
          <Image
            src={workspace.cover}
            alt={`${workspace.name} cover`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h2 className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
            <span className="text-2xl">{workspace.emoji}</span>
            <span className="truncate">{workspace.name}</span>
          </h2>
        </div>
      </div>
      <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <WorkspaceMenu workspace={workspace} />
      </div>
    </div>
  )

  const WorkspaceMenu = ({ workspace }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDeleteClick(workspace)}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {workspaceList?.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        workspaceName={workspaceToDelete?.name}
      />
    </>
  )
})

export default Item