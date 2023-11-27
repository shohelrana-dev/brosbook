import Conversations from "@components/messages/Conversations"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Messages'
}

export default function ConversationsPage() {
    return (
        <div className="px-4 lg:px-6 grid grid-cols-1 md:grid-cols-[1fr_3fr] bg-theme-gray">
            <div className="md:pr-4">
                <Conversations />
            </div>

            <div className="hidden md:block pl-4 py-6 border-solid border-0 border-l-2 border-gray-200">
                <h3 className="text-2xl font-bold">Select a message</h3>
                <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
            </div>
        </div>
    )
}