import { User } from './user.interfaces'

export interface CredentialsPayload {
    username: string
    password: string
}

export interface SignupPayload {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
}

export interface ResetPassPayload {
    password: string
    confirmPassword: string
}

export type LoginResponse = {
    accessToken: string
    expiresIn: string
    tokenType: string
    user: User
}
