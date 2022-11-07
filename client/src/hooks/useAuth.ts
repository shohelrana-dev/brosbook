import {useEffect} from "react"
import {useRouter} from "next/navigation"
import {useGetCurrentUserQuery} from "@services/usersApi";

export default function useAuth(redirectTo?: string, ifGuest: boolean = true){
    const router = useRouter()
    const {data: user, isSuccess: isAuthenticated, isLoading} = useGetCurrentUserQuery()

    useEffect(() => {
        if(!isLoading && redirectTo){
            if(!isAuthenticated && ifGuest){
                router.push(redirectTo)
            }else if (isAuthenticated && !ifGuest){
                router.push(redirectTo)
            }
        }
    }, [isAuthenticated, isAuthenticated])

    return {isLoading, isAuthenticated, user}
}