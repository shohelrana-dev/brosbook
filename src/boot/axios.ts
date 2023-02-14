import axios from "axios"
import { getCookie } from "tiny-cookie"

const access_token = typeof window !== 'undefined' ? getCookie( 'access_token' ) : ''

export const http = axios.create( {
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
    headers: { Authorization: `Bearer ${ access_token }` }
} )