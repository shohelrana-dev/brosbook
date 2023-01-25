import { useSelector } from "react-redux"
import { selectAuthState } from "@slices/authSlice"

export default function useAuthState(  ){
    const { isLoading, isAuthenticated, user } = useSelector( selectAuthState )

    return { isLoading, isAuthenticated, user }
}