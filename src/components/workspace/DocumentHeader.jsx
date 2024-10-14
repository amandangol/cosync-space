import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'

const DocumentHeader = () => {
  return (
    <div className="flex items-center justify-between p-2 px-6 shadow-md">
      <div />
      <OrganizationSwitcher />
      <div className="flex gap-2">
        <Button>Share</Button>
        <UserButton />
      </div>
    </div>
  )
}

export default DocumentHeader
