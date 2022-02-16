import { User } from "./user.interfaces"

export interface LoginFormData {
    username: string
    password: string
}

export interface SignupFormData {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
}

export interface ResetPassFormData {
    password: string
    confirmPassword: string
    token: string
}

export interface AuthState {
    isCheckedAuth: boolean
    isLoading: boolean
    errors: {
        firstName?: { msg: string }
        lastName?: { msg: string }
        email?: { msg: string }
        username?: { msg: string }
        password?: { msg: string }
        confirmPassword?: { msg: string }
    }
    isAuthenticated: boolean
    user: User
}