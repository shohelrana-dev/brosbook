import Button from "@components/global/Button"

export default function Error( { error, reset }: { error: Error; reset: () => void; } ){
    return (
        <div>
            <h2 className="text-lg font-bold">Something went wrong!</h2>
            <Button onClick={ reset }>Try again</Button>
        </div>
    )
}
