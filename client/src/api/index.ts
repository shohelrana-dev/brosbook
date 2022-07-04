import axios from 'axios'
import {LoginFormData, ResetPassFormData, SignupFormData} from '@interfaces/auth.interfaces'
import {ChangePasswordFormData} from "@interfaces/user.interfaces"

//axios config 
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_API_URL!
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

//All api endpoints
const api = {
    auth: {
        me: () => axios.get('/auth/me'),
        signup: (formData: SignupFormData) => axios.post('/auth/signup', formData),
        login: (formData: LoginFormData) => axios.post('/auth/login', formData),
        loginWithGoogle: (token: string) => axios.post('/auth/google', {token}),
        forgotPassword: (email: string) => axios.post('/auth/forgot_password', {email}),
        resetPassTokenVerify: (token: string) => axios.get(`/auth/reset_password/${token}`),
        resetPassword: (formData: ResetPassFormData) => axios.post(`/auth/reset_password/${formData.token}`, formData),
        verifyAccount: (token: string) => axios.get(`/auth/verify_account/${token}`),
        logout: () => axios.get('/auth/logout'),
    },
    chat: {
        fetchConversations: () => axios.get('/chat/conversations'),
        fetchOneConversation: (identifier: string) => axios.get(`/chat/conversations/${identifier}`),
        fetchMessages: (identifier: string) => axios.get(`/chat/messages/${identifier}`),
        createConversation: (participantId: number) => axios.post('/chat/conversations', {participantId}),
    },
    profile: {
        fetchUser: (username: string) => axios.get(`/profile/${username}`),
        fetchPosts: (username: string, page: number, limit?: number) => axios.get(`profile/${username}/posts`, {
            params: {page, limit}
        }),
        fetchFollowers: (username: string, page: number, limit?: number) => axios.get(`profile/${username}/followers`, {
            params: {page, limit}
        }),
        fetchFollowing: (username: string, page: number, limit?: number) => axios.get(`profile/${username}/following`, {
            params: {page, limit}
        }),
    },
    settings: {
        updateProfile: (data: FormData) => axios.put(`/settings/update_profile`, data, {headers: {'Content-Type': 'multipart/form-data'}}),
        changePassword: (data: ChangePasswordFormData) => axios.put(`/settings/change_password`, data)
    },
    posts: {
        fetchPosts: (page: number, limit?: number) => axios.get(`/posts`, {
            params: {page, limit}
        }),
        createPost: (data: FormData) => axios.post(`/posts`, data, {headers: {'Content-Type': 'multipart/form-data'}}),
        savePostLike: (postId: number) => axios.post(`/posts/${postId}/likes`),
        removePostLike: (postId: number) => axios.delete(`/posts/${postId}/likes`),
    },
    comments: {
        fetchComments: (postId: number, page: number, limit?: number) => axios.get(`/posts/${postId}/comments`, {
            params: {page, limit}
        }),
        saveComment: (content: string, postId: number) => axios.post(`/posts/${postId}/comments`, {content}),
        saveCommentLike: (postId: number, commentId: number) => axios.post(`/posts/${postId}/comments/${commentId}/likes`),
        removeCommentLike: (postId: number, commentId: number) => axios.delete(`/posts/${postId}/comments/${commentId}/likes`)
    },
    follows: {
        addFollowing: (username: string) => axios.post(`follows/following/${username}`),
        removeFollowing: (username: string) => axios.delete(`follows/following/${username}`)
    }
}
export default api