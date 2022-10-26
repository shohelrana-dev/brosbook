import argon2 from "argon2"
import {LoginTicket, OAuth2Client, TokenPayload} from "google-auth-library"
import jwt from "jsonwebtoken"
import {v4 as uuid} from "uuid"

import User from "@entities/User"
import {LoginTokenPayload} from "@api/types/index.types"
import {appDataSource} from "@config/data-source.config"
import {LoginUserDTO, ResetPasswordDTO} from "@api/modules/auth/auth.dto"
import BadRequestException from "@exceptions/BadRequestException"
import {SignupUserDTO} from "@modules/auth/auth.dto"
import UnauthorizedException from "@exceptions/UnauthorizedException"
import InternalServerException from "@exceptions/InternalServerException"
import {EmailService} from "@services/email.service"
import Media from "@entities/Media";
import {PhotoSource} from "@api/enums";

class AuthService {
    private userRepository = appDataSource.getRepository(User)

    constructor(private readonly emailService: EmailService) {
    }

    public async signup(payload: SignupUserDTO): Promise<User> {

        let user = new User()
        user.firstName= payload.firstName
        user.lastName = payload.lastName
        user.email = payload.email
        user.username = payload.username
        user.password = payload.password

        user = await this.userRepository.save(user)

        this.emailService.sendEmailVerificationLink(payload.email, payload.username)

        delete user.password

        return user
    }

    public async login({username, password}: LoginUserDTO): Promise<LoginTokenPayload> {
        const user = await this.userRepository.findOne({
            where: [
                { email: username },
                { username }
            ]
        })

        if (!user)  throw new BadRequestException('Account was not found with the email or username.')

        const isPasswordMatched = await argon2.verify(user.password, password)

        if (!isPasswordMatched)  throw new BadRequestException('Invalid password.')

        delete user.password

        if (!user.hasEmailVerified) {
            return { access_token: null, expires_in: null, user, message: 'Email was not verified. ' }
        }

        return AuthService.createJwtLoginToken(user)
    }

    public async google(token: string): Promise<LoginTokenPayload> {
        const oAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        let tokenPayload: TokenPayload = null

        try {
            const ticket: LoginTicket = await oAuthClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            tokenPayload = ticket.getPayload()
        }catch (e) {
            throw new UnauthorizedException( 'Invalid access token.')
        }

        let user = await this.userRepository.findOneBy({ email: tokenPayload.email })

        //make user verified
        if (user && !user.hasEmailVerified) {
            user.emailVerifiedAt = new Date(Date.now()).toISOString()
            await this.userRepository.save(user)
        }

        if(user) return AuthService.createJwtLoginToken(user)

        try {
            //create user
            user = new User()
            user.firstName= tokenPayload.given_name
            user.lastName = tokenPayload.family_name
            user.email = tokenPayload.email
            user.photo = tokenPayload.picture
            user.password = uuid()
            await this.userRepository.save(user)

            const media = new Media()
            media.name = 'Google id photo'
            media.source = PhotoSource.PROFILE
            media.sourceId = user.id
            media.type = 'jpg'
            media.userId = user.id
            media.url = tokenPayload.picture
            await media.save()

            return AuthService.createJwtLoginToken(user)
        }catch (err) {
            throw new InternalServerException('User couldn\'t be created.')
        }
    }

    public async forgotPassword(email: string): Promise<void> {

        const user = await User.findOneBy({ email })

        if (!user)  throw new BadRequestException( 'User not found with the email.')

        this.emailService.sendResetPasswordLink(email)
    }

    public async resetPassword(payload: ResetPasswordDTO) {
        const { password, token } = payload
        let email = null

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
            email = decoded.email
        }catch (e) {
            throw new BadRequestException('Invalid token.')
        }

        const user = await this.userRepository.findOneBy({ email })

        if (!user)  throw new BadRequestException( 'Account not found with the email address.')

        try {
            user.password = await argon2.hash(password)
            await this.userRepository.save(user)
        }catch (err) {
           throw new InternalServerException('Password couldn\'t be changed')
        }
    }

    public async verifyEmail(token: string) {
        let email = null

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET) as any
            email = payload.email
        }catch (e) {
            throw new BadRequestException('Invalid token.')
        }

        let user = await this.userRepository.findOneBy({ email })

        if (!user)  throw new BadRequestException( 'Account was not found.')

        if (user.hasEmailVerified) {
            throw new BadRequestException('The email address already verified')
        }

        try {
            user.emailVerifiedAt = new Date(Date.now()).toISOString()
            user = await user.save()
            return user
        }catch (err) {
            throw new InternalServerException('Email address couldn\'t be verified.')
        }
    }

    public async resendEmailVerificationLink(email: string) {
        const user = await this.userRepository.findOneBy({ email })

        if (!user)  throw new BadRequestException('Account not found with the email address.')

        this.emailService.sendEmailVerificationLink(email,  user.username )
    }

    private static createJwtLoginToken(user: User): LoginTokenPayload {
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