import {Media} from "@interfaces/index.interfaces"

export interface User {
    id: string
    firstName: string
    lastName: string
    fullName: string
    username: string
    email: string
    password?: string
    avatar: Media
    profile?: Profile
    active: number
    hasEmailVerified: boolean
    isViewerFollow: boolean,
    createdAt: string
    updatedAt: string
}

export interface Profile {
    id: string
    username: string
    phone: string
    coverPhoto: Media
    gender: string
    bio: string
    location: string
    birthdate: Date
}