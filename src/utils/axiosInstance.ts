import axios from 'axios'
import { cookies } from 'next/headers'
import { getCookie } from 'tiny-cookie'
import { SERVER_API_URL } from './constants'
import isServer from './isServer'

const accessToken = isServer ? '' : getCookie('accessToken')

export const http = axios.create({
    baseURL: SERVER_API_URL,
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 30000,
})

http.interceptors.request.use((config) => {
    const token = cookies && cookies().get('accessToken')?.value
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const token = cookies && cookies().get('accessToken')?.value
        const refreshToken = cookies && cookies().get('__refresh_token')?.value

        if (token && refreshToken && error.response?.status === 403) {
            //TODO: try to new token and send request again
            const failedRequest = error.config
            try {
                const { data } = await axios.request({
                    url: `${SERVER_API_URL}/auth/refresh_token`,
                    headers: {
                        Cookie: `refreshToken=${refreshToken};`,
                    },
                })

                http.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
                failedRequest.headers.Authorization = `Bearer ${data.accessToken}`
                return await axios(failedRequest)
            } catch {
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)
