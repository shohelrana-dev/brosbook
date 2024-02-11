'use client'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { IoArrowBack as BackIcon } from 'react-icons/io5'
import Modal from 'react-minimal-modal'
import IconButton from '~/components/ui/IconButton'
import Tooltip from '~/components/ui/Tooltip'

export default function AuthModalLayout({ children }: { children: ReactNode }) {
   const pathname = usePathname()
   const router = useRouter()

   return (
      <Modal
         open={pathname.includes('/auth/login') || pathname.includes('/auth/signup')}
         hideIcon
         className="p-[1px] max-w-[420px]"
         onClose={router.back}
         wrapperClassName="overflow-y-auto"
      >
         <Tooltip content="Go Back" disableWrapper>
            <IconButton onClick={router.back} className="absolute left-2 top-2 z-20">
               <BackIcon size={20} />
            </IconButton>
         </Tooltip>

         {children}
      </Modal>
   )
}
