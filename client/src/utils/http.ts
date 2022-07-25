import axios from "axios"

const Http = axios.create( {
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL!,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
} )

export default Http