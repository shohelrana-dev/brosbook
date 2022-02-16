export interface User {
    id: number
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
    followerCount?: number
    followingCount?: number
    createdAt?: string
    updatedAt?: string
}

export interface Profile {
    id: number
    username: string
    phone: string
    coverPhoto: string
    gender: string
    bio: string
    location: string
    birthdate: string
}

export interface SettingsState {
    isLoading: boolean
    errors: {
        firstName?: { msg: string }
        lastName?: { msg: string }
        email?: { msg: string }
        username?: { msg: string }
        oldPassword?: { msg: string }
        newPassword?: { msg: string }
        confirmNewPassword?: { msg: string }
        phone?: { msg: string }
        gender?: { msg: string }
        birthdate?: { msg: string }
        bio?: { msg: string }
        location?: { msg: string }
    }
    user: User
}

export interface UpdateProfileFormData {
    firstName: string
    lastName: string
    bio: string
    phone: string
    location: string
    birthdate: string | null
    gender: string,
    profilePhoto: Blob | null
    coverPhoto: Blob | null
}

export interface ChangePasswordFormData {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}