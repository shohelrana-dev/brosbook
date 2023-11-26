import Conversations from "@components/messages/Conversations"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Messages'
}

export default function ConversationsPage() {
    return (
        <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-4 bg-theme-gray">
            <div className="col-span-4 lg:col-span-1 lg:pr-4">
                <Conversations />
            </div>

            <div className="hidden lg:block col-span-3 pl-4 py-6 border-solid border-0 border-l-2 border-gray-200">
                <h3 className="text-2xl font-bold">Select a message</h3>
                <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
            </div>
        </div>
    )
}