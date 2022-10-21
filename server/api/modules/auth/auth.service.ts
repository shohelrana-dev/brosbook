import { Request } from "express"
import bcrypt from "bcrypt"
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"

import User from "@entities/User"
import { LoginTokenPayload } from "@api/types/index.types"
import sendEmail from "@utils/sendEmail"
import { AppDataSource } from "@config/data-source.config"
import Photo from "@entities/Photo"
import { PhotoSource } from "@api/enums"
import HttpError from "@utils/httpError"
import httpStatus from "http-status"

class AuthService {
    private userRepository = AppDataSource.getRepository(User)

    public async signup(req: Request): Promise<User> {
        const { firstName, lastName, email, username, password } = req.body

        if (!firstName || !lastName || !email || !username || !password) {
            throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, 'Required input field missing.')
        }

        const emailVerificationKey = uuid()

        const user = await this.userRepository.create({
            firstName,
            lastName,
            email,
            username,
            password,
            verificationKey: emailVerificationKey
        }).save()


        AuthService.sendEmailVerificationLink({ email, username, emailVerificationKey })

        return user
    }

    public async login(req: Request): Promise<LoginTokenPayload> {
        const { username, password } = req.body

        if (!username || !password) {
            throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, 'Username and password required.')
        }

        const user = await this.userRepository.findOne({
            where: [
                { email: username },
                { username }
            ]
        })

        if (!user) {
            throw new HttpError(httpStatus.BAD_REQUEST, 'Account is not found with the username.')
        }

        let isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            throw new HttpError(httpStatus.BAD_REQUEST, "Invalid password.")
        }

        if (!user.hasEmailVerified) {
            return { access_token: null, expires_in: null, user, message: 'Email has not been verified. ' }
        }

        return AuthService.generateJwtToken(user)

    }

    public async me(req: Request): Promise<User> {
        return await this.userRepository.findOneOrFail({
            where: { id: req.user.id },
            relations: { profile: true }
        })
    }

    public async google(req: Request): Promise<LoginTokenPayload> {
        const { token } = req.body

        const authClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        const ticket: LoginTicket = await authClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const { email_verified, given_name, family_name, email, picture }: TokenPayload = ticket.getPayload()!

        if (!email_verified) throw new HttpError(httpStatus.UNAUTHORIZED, 'Email address was not verified')

        let user = await this.userRepository.findOneBy({ email })

        //make user verified
        if (user && !user.emailVerifiedAt) {
            user.emailVerifiedAt = new Date(Date.now()).toISOString()
            await user.save()
        }

        //created user and profile
        if (!user) {
            user = await this.userRepository.create({
                firstName: given_name,
                lastName: family_name,
                email: email,
                photo: picture,
                password: email + process.env.JWT_SECRET!,
                emailVerifiedAt: new Date(Date.now()).toISOString()
            }).save()

            await Photo.create({
                name: 'Google profile photo',
                userId: user.id,
                sourceId: user.id,
                source: PhotoSource.PROFILE,
                type: 'image/jpg',
                url: picture
            }).save()
        }

        return AuthService.generateJwtToken(user)
    }

    public async forgotPassword(req: Request): Promise<void> {
        const { email } = req.body

        const user = await User.findOneBy({ email })
        if (!user) {
            throw new HttpError(httpStatus.BAD_REQUEST, 'User not found with the email.')
        }

        const resetPasswordKey = uuid()
        const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?email=${email}&key=${resetPasswordKey}`

        //save verification key
        user.verificationKey = resetPasswordKey
        await user.save()

        //send email
        const appName = process.env.APP_NAME || 'Brosbook'
        const subject = `[${appName}] Please reset your password`
        const html = /*html*/`
                <div style="max-width: 520px; margin: auto; margin-top: 20px;">
                    <h1 style="font-weight: bold;">Reset your ${appName} password</h1>
                    <div style="border: 1px solid #ddd; border-radius: 10px; padding: 25px;">
                        <h2 style="font-weight: bold; text-align: center; margin-top: 0;">Reset password</h2>
                        <div>
                            <p style="margin-top: 0; margin-bottom: 5px;">Sorry to hear you’re having trouble logging into ${appName}. </p>
                            <p style="margin-top: 0; margin-bottom: 5px;">We got a message that you forgot your password.</p>
                            <p style="margin-top: 0; margin-bottom: 5px;">If this was you, you can reset your password following the button.</p>
                        </div>
                        <div style="text-align: center; margin-top: 28px;">
                            <a href="${resetLink}" 
                                style="display: inline-block; background: rgb(58,141,245); color: #fff; padding: 10px 25px; border-radius: 5px; text-decoration: none;">
                                <strong>Reset your password</strong>
                            </a>
                        </div>
                    </div>
                    <p>Didn’t request this change? You can ignore this email.</p>
                </div>
            `

        sendEmail(email, subject, html)
    }

    public async resetPassword(req: Request) {
        const { password, email, key } = req.body

        if (!password || !email || !key) {
            throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, 'Password, email, Verification key required.')
        }

        const user = await this.userRepository.findOneBy({ email })
        if (!user) {
            throw new HttpError(httpStatus.BAD_REQUEST, 'User not found with the email address.')
        }

        if (!user.verificationKey || user.verificationKey !== key) {
            throw new HttpError(httpStatus.BAD_REQUEST, 'Verification key is invalid.')
        }

        user.password = await bcrypt.hash(password, 6)
        user.emailVerifiedAt = new Date(Date.now()).toISOString()
        await user.save()
    }

    public async verifyEmail(req: Request) {
        const email = req.query.email as string
        const key = req.query.key as string

        if (!email || !key) {
            throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, 'Email or verification key is missing.')
        }

        const user = await this.userRepository.findOneBy({ email })

        if (!user) {
            throw new HttpError(httpStatus.BAD_REQUEST, 'User not found with the email address.')
        }

        if (user.hasEmailVerified) {
            throw new HttpError(httpStatus.BAD_REQUEST, 'The user account already verified')
        }

        if (!user.verificationKey || user.verificationKey !== key) {
            throw new HttpError(httpStatus.BAD_REQUEST, 'Verification key is invalid.')
        }

        user.emailVerifiedAt = new Date(Date.now()).toISOString()
        await user.save()
        return user
    }

    public async resendVerificationLink(req: Request) {
        const email = req.body.email as string
        const emailVerificationKey = uuid()

        const user = await this.userRepository.findOneBy({ email })

        if (!user) {
            throw new HttpError(httpStatus.BAD_REQUEST, 'User not found with the email address.')
        }

        user.verificationKey = emailVerificationKey
        await user.save()

        AuthService.sendEmailVerificationLink({ email, username: user.username, emailVerificationKey })

    }

    private static sendEmailVerificationLink(data: { email: string, username: string, emailVerificationKey: string }) {
        const { email, username, emailVerificationKey } = data
        const appName = process.env.APP_NAME || 'Brosbook'
        const verificationLink = `${process.env.CLIENT_URL}/auth/email/verify?email=${email}&key=${emailVerificationKey}`
        const subject = `[${appName}] Please verify your email address`

        const html = /*html*/`
                <div style="max-width: 520px; margin: auto; margin-top: 20px;">
                    <h1 style="font-weight: normal;">Almost done, @<strong>${username}</strong></h1>
                    <div style="border: 1px solid #ddd; border-radius: 10px; padding: 25px;">
                        <div style="margin-bottom: 25px">
                            <p style="margin: 0;">To secure your ${appName} account, we just need to verify your email address:</p>
                            <strong><a href="mailto:${email}" style="text-decoration: none;">${email}</a> </strong>
                        </div>
                        <div>
                            <a href="${verificationLink}" 
                                style="display: inline-block; background: rgb(58,141,245); color: #fff; padding: 10px 25px; border-radius: 5px; text-decoration: none;">
                                Verify email address
                            </a>
                        </div>
                    </div>
                    <p>This will let you receive notifications and password resets from ${appName}.</p>
                </div>
            `

        sendEmail(email, subject, html)
    }

    private static generateJwtToken(user: User): LoginTokenPayload {
        const dataStoredInToken = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        const secretKey = process.env.JWT_SECRET!
        const expires_in = process.env.JWT_EXPIRY! || '1h'

        let access_token = jwt.sign(dataStoredInToken, secretKey, { expiresIn: expires_in })
        return { access_token, expires_in, token_type: 'Bearer', user }
    }
}

export default AuthService