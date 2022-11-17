import argon2 from "argon2"
import Profile from "@entities/Profile"
import User from "@entities/User"
import BadRequestException from "@exceptions/BadRequestException"
import UnprocessableEntityException from "@exceptions/UnprocessableEntityException"
import InternalServerException from "@exceptions/InternalServerException"
import {ChangePasswordDTO, ChangeUsernameDTO, UpdateProfileDTO} from "@modules/account/account.dto"

export default class AccountService {

    public async updateProfile(payload: UpdateProfileDTO): Promise<User> {
        try {
            const {userId, firstName, lastName, bio, phone, location, birthdate, gender } = payload

            const profile = await Profile.findOneBy({ userId })
            profile.userId = userId
            profile.bio = bio
            profile.phone = phone
            profile.location = location
            profile.birthdate = birthdate
            profile.gender = gender
            await profile.save()

            const user = await User.findOneBy({ id: userId })
            user.firstName = firstName
            user.lastName = lastName
            await user.save()

            user.profile = profile

            delete user.password

            return user
        }catch (err) {
            throw new InternalServerException('Profile couldn\'t be updated')
        }
    }

    public async changeUsername({username, password, userId}: ChangeUsernameDTO) {

        const user = await User.findOneBy({ id: userId })

        if (!username) throw new BadRequestException("Username field not be empty.")

        if (!user) throw new BadRequestException("User not found.")

        const isMatched = await argon2.verify(user.password, password)

        if (!isMatched) throw new UnprocessableEntityException("Invalid Password.")

        try {
            user.username = username
            return await user.save()
        } catch (err) {
            throw new InternalServerException("Username couldn't be changed")
        }
    }

    public async changePassword({currentPassword, newPassword, userId}: ChangePasswordDTO) {

        const user = await User.findOneBy({ id: userId })

        if (!user) throw new BadRequestException("Password couldn't be change")

        const isMatched = await argon2.verify(user.password, currentPassword)

        if (!isMatched) throw new UnprocessableEntityException("Current password didn't match")

        user.password = await argon2.hash(newPassword)

        try {
            await user.save()
        } catch (err) {
            throw new InternalServerException("Password couldn't be changed")
        }
    }
}