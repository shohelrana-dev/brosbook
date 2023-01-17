import axios from "axios"
import Cookies from "js-cookie"

const access_token = typeof window !== 'undefined' ? Cookies.get('access_token') : ''

export const http = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
    headers: {Authorization: `Bearer ${access_token}`}
})