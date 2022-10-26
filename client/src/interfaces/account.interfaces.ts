export interface ProfileErrors {
        firstName?: string
        lastName?: string
        username?: string
        phone?: string
        gender?: string
        birthdate?: string
        bio?: string
        location?: string
}

export interface ProfilePayload {
        firstName: string
        lastName: string
        username: string
        phone: string
        gender: string
        birthdate: string
        bio: string
        location: string
}

export interface ChangePasswordPayload {
        currentPassword: string
        newPassword: string
        confirmNewPassword: string
}

export interface ChangePasswordErrors {
        currentPassword?: string
        newPassword?: string
        confirmNewPassword?: string
}