'use client'
import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '~/assets/images/logo.png'
import titledLogo from '~/assets/images/titled-logo.png'
import MessagesNavLink from '~/components/header/MessagesNavLink'
import NotificationsNavLink from '~/components/header/NotificationsNavLink'
import SearchButton from '~/components/header/SearchButton'
import UserMenu from '~/components/header/UserMenu'
import Button from '~/components/ui/Button'
import useAuth from '~/hooks/useAuth'
import useMediaQuery from '~/hooks/useMediaQuery'

export default function Header() {
   const isScreenSmall = useMediaQuery('(max-width: 767px)')
   const { isAuthenticated } = useAuth()
   const pathname = usePathname()

   return (
      <Navbar className='h-navbar'>
         <div className='container flex flex-wrap items-center justify-between text-gray-900'>
            <NavbarBrand>
               <Link href='/'>
                  {isScreenSmall ? (
                     <Image priority src={logo} alt={'Brosbook logo'} width={31} height={40} />
                  ) : (
                     <Image
                        priority
                        src={titledLogo}
                        alt={'Brosbook logo'}
                        width={135}
                        height={40}
                        className='max-w-36'
                     />
                  )}
               </Link>
            </NavbarBrand>

            <NavbarContent as='div' justify='end' className='gap-1'>
               <SearchButton />
               {isAuthenticated ? (
                  <>
                     <NotificationsNavLink />
                     <MessagesNavLink />
                     <UserMenu />
                  </>
               ) : (
                  <>
                     &nbsp;
                     <Button
                        as={Link}
                        href={`/auth/login${
                           pathname.startsWith('/auth') ? '' : '?redirect_to=' + pathname
                        }`}
                        size='sm'
                     >
                        Login
                     </Button>
                  </>
               )}
            </NavbarContent>
         </div>
      </Navbar>
   )
}
