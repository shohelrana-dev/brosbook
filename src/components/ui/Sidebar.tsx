'use client'
import Followers from '~/components/widgets/Followers'
import NewUserMessage from '~/components/widgets/NewUserMessage'
import SuggestedPeople from '~/components/widgets/SuggestedPeople'
import useMediaQuery from '~/hooks/useMediaQuery'

export default function Sidebar() {
   const isLaptopOrDesktop = useMediaQuery('(min-width: 768px)')

   if (!isLaptopOrDesktop) return null

   return (
      <aside className='mt-4'>
         <div className='sticky top-[calc(var(--nav-height)_+_1rem)]'>
            <NewUserMessage />
            <SuggestedPeople />
            <Followers />
         </div>
      </aside>
   )
}
