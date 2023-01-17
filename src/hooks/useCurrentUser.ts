import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useGetCurrentUserQuery } from "@services/usersApi"

interface UseCurrentUserOptions {
    redirectTo?: string
    isProtected?: boolean
}

export default function useCurrentUser( { redirectTo, isProtected = true }: UseCurrentUserOptions = {} ){
    const router                                                = useRouter()
    const pathname                                              = usePathname()
    const { data: user, isLoading, isSuccess: isAuthenticated } = useGetCurrentUserQuery()

    useEffect( () => {
        if( ! isLoading && redirectTo ){
            if( isAuthenticated && isProtected ) return
            if( ! isAuthenticated && ! isProtected ) return

            router.push( `${ redirectTo }?redirect_path=${ pathname }` )
        }
    }, [isAuthenticated, isLoading] )

    return { isLoading, isAuthenticated, user }
}