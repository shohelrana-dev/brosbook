import { useEffect, useState } from "react"

export default function useMediaQuery( query: string ){
    const [isMatched, setIsMatched] = useState<boolean>( false )
    useEffect( () => {
        const media    = window.matchMedia( query )
        const listener = () => setIsMatched( media.matches )
        listener()
        window.addEventListener( 'resize', listener )

        return () => window.removeEventListener( 'resize', listener )
    }, [isMatched] )

    return isMatched
}