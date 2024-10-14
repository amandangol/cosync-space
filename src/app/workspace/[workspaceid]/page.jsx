import { Room } from '@/components/Room'
import SideNavbar from '@/components/workspace/SideNavbar'

const Workspace = ({ params }) => {
  return (
    <Room params={params}>
      <SideNavbar params={params} />
    </Room>
  )
}

export default Workspace
