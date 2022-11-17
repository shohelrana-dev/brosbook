export interface User {
    id: string
    firstName: string
    lastName: string
    fullName: string
    username: string
    email: string
    password?: string
    phone?: string
    photo: string
    profile?: Profile
    active: number
    hasEmailVerified: boolean
    followerCount?: number
    followingCount?: number
    isCurrentUserFollow: boolean,
    createdAt: string
    updatedAt: string
}

export interface Profile {
    id: string
    username: string
    phone: string
    coverPhoto: string
    gender: string
    bio: string
    location: string
    birthdate: Date
}