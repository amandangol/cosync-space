import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/syncspace-dashboard">
      <Image src="/images/logo.svg" alt="logo" width={32} height={32} />
    </Link>
  )
}

export default Logo
