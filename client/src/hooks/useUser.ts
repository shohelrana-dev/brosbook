import {useEffect} from "react"
import {useRouter} from "next/navigation"
import {useGetCurrentUserQuery} from "@services/usersApi"

interface UseUserOptions {
    redirectTo?: string
    isProtected?: boolean
}

export default function useUser({redirectTo, isProtected = true}: UseUserOptions = {}){
    const router = useRouter()
    const {data: user, isSuccess: isAuthenticated, isLoading} = useGetCurrentUserQuery()

    useEffect(() => {
        if(!isLoading && redirectTo){
            if(isAuthenticated && isProtected) return
            if(!isAuthenticated && !isProtected) return

            router.push(redirectTo)
        }
    }, [isAuthenticated, isLoading])

    return {isLoading, isAuthenticated, user}
}