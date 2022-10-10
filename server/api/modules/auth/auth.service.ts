import { Request }                                 from "express"
import bcrypt                                      from "bcrypt"
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library"
import jwt                                         from "jsonwebtoken"
import { v4 as uuid }                              from "uuid"

import User                  from "@entities/User"
import { LoginTokenPayload } from "@api/types/index.types"
import sendEmail             from "@utils/sendEmail"
import { AppDataSource }     from "@config/data-source.config"
import Photo                 from "@entities/Photo"
import { PhotoSource }       from "@api/enums"
import HttpError             from "@utils/httpError"
import httpStatus            from "http-status"

class AuthService {
    private userRepository = AppDataSource.getRepository( User )

    public async signup( req: Request ): Promise<User>{
        const { firstName, lastName, email, username, password } = req.body

        if( ! firstName || ! lastName || ! email || ! username || ! password ){
            throw new HttpError( httpStatus.UNPROCESSABLE_ENTITY, 'Required input field missing.' )
        }

        const emailVerificationKey = uuid()

        const user = await this.userRepository.create( {
            firstName,
            lastName,
            email,
            username,
            password,
            verificationKey: emailVerificationKey
        } ).save()


        AuthService.sendEmailVerificationLink( { email, username, emailVerificationKey } )

        return user
    }

    public async login( req: Request ): Promise<LoginTokenPayload>{
        const { username, password } = req.body

        if( ! username || ! password ){
            throw new HttpError( httpStatus.UNPROCESSABLE_ENTITY, 'Username and password required.' )
        }

        const user = await this.userRepository.findOne( {
            where: [
                { email: username },
                { username }
            ]
        } )

        if( ! user ){
            throw new HttpError( httpStatus.BAD_REQUEST, 'Account is not found with the username.' )
        }

        let isPasswordMatched = await bcrypt.compare( password, user.password )

        if( ! isPasswordMatched ){
            throw new HttpError( httpStatus.BAD_REQUEST, "Invalid password." )
        }

        if( ! user.hasEmailVerified ){
            return { access_token: null, expires_in: null, user, message: 'Email has not been verified. ' }
        }

        return AuthService.generateJwtToken( user )

    }

    public async me( req: Request ): Promise<User>{
        return await this.userRepository.findOneOrFail( {
            where: { id: req.user.id },
            relations: ['profile']
        } )
    }

    public async google( req: Request ): Promise<LoginTokenPayload>{
        const { token } = req.body

        const authClient          = new OAuth2Client( process.env.GOOGLE_CLIENT_ID )
        const ticket: LoginTicket = await authClient.verifyIdToken( {
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        } )

        const { email_verified, given_name, family_name, email, picture }: TokenPayload = ticket.getPayload()!

        if( ! email_verified ) throw new HttpError( httpStatus.UNAUTHORIZED, 'Email address was not verified' )

        let user = await this.userRepository.findOneBy( { email } )

        //make user verified
        if( user && ! user.emailVerifiedAt ){
            user.emailVerifiedAt = new Date( Date.now() ).toISOString()
            await user.save()
        }

        //created user and profile
        if( ! user ){
            user = await this.userRepository.create( {
                firstName: given_name,
                lastName: family_name,
                email: email,
                photo: picture,
                password: email + process.env.JWT_SECRET!,
                emailVerifiedAt: new Date( Date.now() ).toISOString()
            } ).save()

            await Photo.create( {
                name: 'Google profile photo',
                userId: user.id,
                sourceId: user.id,
                source: PhotoSource.PROFILE,
                type: 'image/jpg',
                url: picture
            } ).save()
        }

        return AuthService.generateJwtToken( user )
    }

    public async forgotPassword( req: Request ): Promise<void>{
        const { email } = req.body

        const user = await User.findOneBy( { email } )
        if( ! user ){
            throw new HttpError( httpStatus.BAD_REQUEST, 'User not found with the email.' )
        }

        const resetPasswordKey = uuid()
        const resetLink        = `${ process.env.CLIENT_URL }/auth/reset-password?email=${ email }&key=${ resetPasswordKey }`

        //save verification key
        user.verificationKey = resetPasswordKey
        await user.save()

        //send email
        const subject = `${ user.username }, we've made it easy to get back on ${ process.env.APP_NAME }`
        const html    = `
                <div>
                    <h3><strong>Hi, ${ user.username },</strong></h3>
                    </br>
                    <div>
                        <p>Sorry to hear you’re having trouble logging into ${ process.env.APP_NAME }. </p>
                        <p>We got a message that you forgot your password.</p>
                        <p>If this was you, you can reset your password now.</p>
                    </div>
                    </br>
                    <div>
                        <a href="${ resetLink }">
                            <strong>Reset your password</strong>
                        </a>
                    </div>
                </div>
            `

        sendEmail( email, subject, html )
    }

    public async resetPassword( req: Request ){
        const { password, email, key } = req.body

        if( ! password || ! email || ! key ){
            throw new HttpError( httpStatus.UNPROCESSABLE_ENTITY, 'Password, email, Verification key required.' )
        }

        const user = await this.userRepository.findOneBy( { email } )
        if( ! user ){
            throw new HttpError( httpStatus.BAD_REQUEST, 'User not found with the email address.' )
        }

        if( ! user.verificationKey || user.verificationKey !== key ){
            throw new HttpError( httpStatus.BAD_REQUEST, 'Verification key is invalid.' )
        }

        user.password        = await bcrypt.hash( password, 6 )
        user.emailVerifiedAt = new Date( Date.now() ).toISOString()
        await user.save()
    }

    public async verifyEmail( req: Request ){
        const email = req.query.email as string
        const key   = req.query.key as string

        if( ! email || ! key ){
            throw new HttpError( httpStatus.UNPROCESSABLE_ENTITY, 'Email or verification key is missing.' )
        }

        const user = await this.userRepository.findOneBy( { email } )

        if( ! user ){
            throw new HttpError( httpStatus.BAD_REQUEST, 'User not found with the email address.' )
        }

        if( user.hasEmailVerified ){
            throw new HttpError( httpStatus.BAD_REQUEST, 'The user account already verified' )
        }

        if( ! user.verificationKey || user.verificationKey !== key ){
            throw new HttpError( httpStatus.BAD_REQUEST, 'Verification key is invalid.' )
        }

        user.emailVerifiedAt = new Date( Date.now() ).toISOString()
        await user.save()
        return user
    }

    public async resendVerificationLink( req: Request ){
        const email                = req.body.email as string
        const emailVerificationKey = uuid()

        const user = await this.userRepository.findOneBy( { email } )

        if( ! user ){
            throw new HttpError( httpStatus.BAD_REQUEST, 'User not found with the email address.' )
        }

        user.verificationKey = emailVerificationKey
        await user.save()

        AuthService.sendEmailVerificationLink( { email, username: user.username, emailVerificationKey } )

    }

    private static sendEmailVerificationLink( data: { email: string, username: string, emailVerificationKey: string } ){
        const { email, username, emailVerificationKey } = data

        const verificationLink = `${ process.env.CLIENT_URL }/auth/email/verify?email=${ email }&key=${ emailVerificationKey }`
        const subject          = `Please activate your account, thank you for signup on ${ process.env.APP_NAME }`
        const html             = `
                <div>
                    <h3>Hi ${ username },</h3>
                    </br>
                    </br>
                        <p>Please click the following link to activate your account: </p>
                    </br>
                    <p><a href="${ verificationLink }"><strong>Verify account</strong></a></p>
                </div>
            `

        sendEmail( email, subject, html )
    }

    private static generateJwtToken( user: User ): LoginTokenPayload{
        const dataStoredInToken = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        const secretKey         = process.env.JWT_SECRET!
        const expires_in        = process.env.JWT_EXPIRY! || '1h'

        let access_token = jwt.sign( dataStoredInToken, secretKey, { expiresIn: expires_in } )
        return { access_token, expires_in, token_type: 'Bearer', user }
    }
}

export default AuthService