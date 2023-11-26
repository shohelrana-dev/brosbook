import { useSelector } from "react-redux"
import { selectNavbarHeight } from '@slices/navbarHeightSlice'

export default function useNavbarHeight(){
    return useSelector( selectNavbarHeight )
}