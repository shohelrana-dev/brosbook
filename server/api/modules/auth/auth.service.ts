import { Request }                                 from "express"
import bcrypt                                      from "bcrypt"
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library"
import jwt                                         from "jsonwebtoken"
import { v4 as uuid }                              from "uuid"

import User                  from "@entities/User"
import { LoginTokenPayload } from "@api/types/index.types"
import sendEmail             from "@utils/sendEmail"
import Verification          from "@entities/Verification"
import { AppDataSource }     from "@config/data-source.config";

class AuthService {
    private userRepository = AppDataSource.getRepository( User )

    public async signup( req: Request ): Promise<User>{
        const { firstName, lastName, email, username, password } = req.body

        const user = await this.userRepository.create( { firstName, lastName, email, username, password } ).save()

        const verificationKey = uuid()

        await Verification.create( {
            key: verificationKey,
            userId: user.id
        } ).save()


        const verificationLink = `${ process.env.CLIENT_URL }/auth/verify-account?email=${ email }&key=${ verificationKey }`
        const subject          = `Please activate your account, thank you for signup on ${ process.env.APP_NAME }`
        const html             = `
                <div>
                    <h3>Hi ${ user.username },</h3>
                    </br>
                    </br>
                        <p>Please click the following link to activate your account: </p>
                    </br>
                    <p><a href="${ verificationLink }"><strong>Verify account</strong></a></p>
                </div>
            `

        sendEmail( email, subject, html )

        return user
    }

    public async login( req: Request ): Promise<LoginTokenPayload>{
        const { username, password } = req.body

        const user = await this.userRepository.findOne( {
            where: [
                { email: username },
                { username }
            ]
        } )

        if( ! user ){
            throw new Error( 'Account is not found with the username.' )
        }

        let isPasswordMatched = await bcrypt.compare( password, user.password )

        if( ! isPasswordMatched ){
            throw new Error( "Password didn't match" )
        }

        if( user.verified !== 1 ){
            throw new Error( 'The account is not activate yet, please check your email.' )
        }

        return AuthService.generateJwtToken( user )

    }

    public async me( req: Request ): Promise<User>{
        try {
            return await this.userRepository.findOneOrFail( {
                where: { id: req.user.id },
                relations: ['profile']
            } )
        } catch ( e ) {
            throw new Error( 'User could not be found.' )
        }
    }

    public async google( req: Request ): Promise<LoginTokenPayload>{
        const { token } = req.body

        const authClient          = new OAuth2Client( process.env.GOOGLE_CLIENT_ID )
        const ticket: LoginTicket = await authClient.verifyIdToken( {
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        } )

        const { email_verified, given_name, family_name, email, picture }: TokenPayload = ticket.getPayload()!

        if( ! email_verified ) throw new Error( 'Email address was not verified' )

        let user = await this.userRepository.findOneBy( { email } )

        //make user verified
        if( user && ! user.verified ){
            user.verified = 1
            await user.save()
        }

        //created user
        if( ! user ){
            user = this.userRepository.create( {
                firstName: given_name,
                lastName: family_name,
                email: email,
                photo: picture,
                password: email + process.env.JWT_SECRET!,
                verified: 1
            } )
            try {
                await user.save()
            } catch ( err ) {
                throw new Error( "User account couldn't be created" )
            }
        }

        return AuthService.generateJwtToken( user )
    }

    public async forgotPassword( req: Request ): Promise<void>{
        const { email } = req.body

        const user = await User.findOneBy( { email } )
        if( ! user ){
            throw new Error( 'User not found with the email' )
        }

        const verification     = await Verification.findOneBy( { userId: user.id } )
        const resetPasswordKey = uuid()
        const resetLink        = `${ process.env.CLIENT_URL }/auth/reset-password?email=${ email }&key=${ resetPasswordKey }`

        if( ! verification ){
            const createVerification = await Verification.create( {
                key: resetPasswordKey,
                userId: user.id
            } )
            await createVerification.save()
        } else{
            verification.key = resetPasswordKey
            await verification.save()
        }

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

        if( ! password ) throw new Error( 'Password required.' )

        try {
            const user    = await this.isVerificationKeyValid( { email, key } )
            user.password = await bcrypt.hash( password, 6 )
            user.verified = 1
            await user.save()
        } catch ( err ) {
            throw err
        }
    }

    public async verifyAccount( req: Request ){
        const email = req.query.email as string
        const key   = req.query.key as string

        const user = await this.isVerificationKeyValid( { email, key } )

        if( user.verified ) throw new Error( 'The user account already verified' )

        user.verified = 1
        await user.save()
        return user
    }

    private async isVerificationKeyValid( { email, key }: { email: string, key: string } ): Promise<User>{

        if( ! email || ! key ) throw new Error( 'Email or verification key is missing.' )

        const user = await this.userRepository.findOneBy( { email } )

        if( ! user ) throw new Error( 'User not found with the email address.' )

        const verification = await Verification.findOneBy( { userId: user?.id } )
        if( verification?.key === key ){
            return user
        }

        throw new Error( 'Verification key is invalid.' )
    }

    private static generateJwtToken( user: User ): LoginTokenPayload{
        const dataStoredInToken = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        const secretKey         = process.env.JWT_SECRET!
        const expiresIn         = process.env.JWT_EXPIRY! || '1h'

        let access_token = jwt.sign( dataStoredInToken, secretKey, { expiresIn: expiresIn } )
        return { access_token, expiresIn, token_type: 'Bearer', user }
    }
}

export default AuthService