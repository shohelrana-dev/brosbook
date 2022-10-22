import { Request } from "express"
import bcrypt from "bcrypt"

import HttpError from "@utils/httpError"
import Profile from "@api/entities/Profile"
import User from "@api/entities/User"
import httpStatus from "http-status"

export default class AccountService {

    public async updateProfile(req: Request): Promise<User> {
        const { firstName, lastName, username, bio, phone, location, birthdate, gender } = req.body

        let profile = await Profile.findOneBy({ userId: req.user.id })
        if (!profile) {
            profile = new Profile()
        }

        profile.userId = req.user.id
        profile.bio = bio
        profile.phone = phone
        profile.location = location
        profile.birthdate = birthdate
        profile.gender = gender
        await profile.save()

        const user = await User.findOneBy({ id: req.user.id })
        user.firstName = firstName
        user.lastName = lastName
        user.username = username
        await user.save()

        user.profile = profile

        return user
    }

    public async changePassword(req: Request) {
        const { currentPassword, newPassword } = req.body

        const user = await User.findOneBy({ username: req.user.username })

        if (!user) throw new HttpError(httpStatus.CONFLICT, "Password couldn't be change")

        const isMatched = await bcrypt.compare(currentPassword, user.password)

        if (!isMatched) throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, "Current password didn't match")

        user.password = await bcrypt.hash(newPassword, 6)

        try {
            await user.save()
        } catch (err) {
            throw new HttpError(httpStatus.CONFLICT, "Password couldn't be changed")
        }
    }
}