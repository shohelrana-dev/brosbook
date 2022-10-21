export interface ProfileErrors {
        firstName?: { msg: string }
        lastName?: { msg: string }
        username?: { msg: string }
        phone?: { msg: string }
        gender?: { msg: string }
        birthdate?: { msg: string }
        bio?: { msg: string }
        location?: { msg: string }
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
        currentPassword?: { msg: string }
        newPassword?: { msg: string }
        confirmNewPassword?: { msg: string }
}