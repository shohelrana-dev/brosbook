"use client"
import Button from "@components/global/Button"

export default function Error( { error, reset }: { error: Error; reset: () => void; } ){
    return (
        <div className="w-full h-full flex items-center justify-center flex-col">
            <h2 className="text-lg font-bold">Something went wrong!</h2>
            <Button onClick={ reset }>Try again</Button>
        </div>
    )
}
