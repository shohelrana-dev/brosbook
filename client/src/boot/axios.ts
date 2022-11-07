import axios from "axios"
import Cookies from "js-cookie"

const access_token = typeof window !== 'undefined' ? Cookies.get('access_token') : ''

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
    headers: {Authorization: `Bearer ${access_token}`}
})