import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const NewWorkspaceButton = () => {
  const router = useRouter()

  const handleCreateWorkspace = () => {
    router.push('/syncspace-create')
  }

  return (
    <Button onClick={handleCreateWorkspace} className="flex items-center gap-2">
      <PlusIcon size={20} />
      New Workspace
    </Button>
  )
}

export default NewWorkspaceButton