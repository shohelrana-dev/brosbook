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