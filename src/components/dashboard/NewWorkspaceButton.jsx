import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const NewWorkspaceButton = () => {
  const router = useRouter()
  const handleCreateWorkspace = () => {
    router.push('/cosyncspace-create')
  }
  return (
    <Button onClick={handleCreateWorkspace} className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
      <PlusIcon size={20} />
      New Workspace
    </Button>
  )
}

export default NewWorkspaceButton