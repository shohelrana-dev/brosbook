import { useSelector } from "react-redux"
import { selectAuthState } from "@slices/authSlice"

export default function useAuthState(){
    const authState = useSelector( selectAuthState )

    return authState
}