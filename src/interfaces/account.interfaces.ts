export interface ProfilePayload {
        firstName: string
        lastName: string
        phone: string
        gender: string
        birthdate?: Date
        bio: string
        location: string
}

export interface ChangePasswordPayload {
        currentPassword: string
        newPassword: string
        confirmNewPassword: string
}

export interface ChangeUsernamePayload {
        password: string
        username: string
}