import { Link, MoreVertical, PenBox, Trash2 } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const DocumentOptions = ({ doc, deleteDocument }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="flex gap-2">
            <Link size={16} /> Share Link
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2">
            <PenBox size={16} />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deleteDocument(doc?.id)}
            className="flex gap-2 text-red-500"
          >
            <Trash2 size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default DocumentOptions
