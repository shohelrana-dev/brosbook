import SidebarLayout from '~/components/global/SidebarLayout'
import SuggestionList from './SuggestionList'

export const revalidate = 0

export default function SuggestionsPage() {
    return (
        <SidebarLayout>
            <div className='bg-white p-3 pt-4'>
                <h2 className='text-lg md:text-xl font-bold mb-4'>Suggested for you</h2>

                <SuggestionList />
            </div>
        </SidebarLayout>
    )
}
