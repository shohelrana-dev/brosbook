import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Messages'
}

export default function Page(){
    return (
        <>
            <h3 className="text-2xl font-bold">Select a message</h3>
            <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
        </>
    )
}