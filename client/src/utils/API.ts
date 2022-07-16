import axios from "axios"

const API = axios.create( {
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL!,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
} )

export default API