'use client'
import Followers from '~/components/widgets/Followers'
import NewUserMessage from '~/components/widgets/NewUserMessage'
import SuggestedPeople from '~/components/widgets/SuggestedPeople'
import useAuth from '~/hooks/useAuth'
import useMediaQuery from '~/hooks/useMediaQuery'

export default function Sidebar() {
    const isSmallScreen = useMediaQuery('(max-width: 768px)')
    const { isAuthenticated } = useAuth()

    if (isSmallScreen) return null

    return (
        <aside className='mt-4 hidden lg:block'>
            <div className='sticky top-[calc(var(--nav-height)_+_1rem)]'>
                {isAuthenticated ? (
                    <>
                        <SuggestedPeople />
                        <Followers />
                    </>
                ) : (
                    <NewUserMessage />
                )}
            </div>
        </aside>
    )
}
