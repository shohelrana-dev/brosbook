import { Request }                                 from "express"
import bcrypt                                      from "bcrypt"
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library"
import jwt                                         from "jsonwebtoken"
import crypto                                      from "crypto"

import User                 from "@entities/User"
import HttpException        from "@exceptions/http.exception"
import { TokenData }        from "@interfaces/index.interfaces"
import { decrypt, encrypt } from "@utils/encryptDecrypt"
import sendEmail            from "@utils/sendEmail"
import Verification         from "@entities/Verification";

class AuthService {

    public async signup( req: Request ): Promise<User> {
        const { firstName, lastName, email, username, password } = req.body

        const user = User.create( { firstName, lastName, email, username, password } )

        let verifyToken  = crypto.randomBytes( 16 ).toString( 'hex' )
        verifyToken      = `${ verifyToken }.${ encrypt( email ) }`
        const verifyLink = `${ process.env.CLIENT_URL }/auth/verify_account/${ verifyToken }`

        await Verification
            .create( {
                token: verifyToken,
                username: user.username
            } )
            .save()

        const subject = `Please activate your account, thank you for signup on ${ process.env.APP_NAME }`
        const html    = `
                <div>
                    <p>Hi ${ user.username },</p>
                    </br>
                    </br>
                        <p>Please click the following link to activate your account: </p>
                    </br>
                    <p><a href="${ verifyLink }">Verify account</a></p>
                </div>
            `

        sendEmail( email, subject, html )

        return await user.save()
    }

    public async login( req: Request ): Promise<TokenData> {
        const { username, password } = req.body

        const user = await User.findOne( {
            where: [
                { email: username },
                { username }
            ]
        } )

        if ( !user ) {
            throw new HttpException( 'Account is not found with the username.', 401 )
        }

        let isPasswordMatched = await bcrypt.compare( password, user.password )

        if ( !isPasswordMatched ) {
            throw new HttpException( "Password didn't match", 401 )
        }

        if ( user.verified !== 1 ) {
            throw new HttpException( 'The account is not activate yet, please check your email.', 401 )
        }

        const tokenData = this.generateJwtToken( user )
        return { ...tokenData, user }

    }

    public async google( req: Request ): Promise<TokenData> {
        const { token } = req.body

        const authClient          = new OAuth2Client( process.env.GOOGLE_CLIENT_ID )
        const ticket: LoginTicket = await authClient.verifyIdToken( {
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        } )

        const { email_verified, given_name, family_name, email, picture }: TokenPayload = ticket.getPayload()!

        if ( email_verified ) {
            let user = await User.findOne( { email } )
            //make verified user
            if ( user && !user.verified ) {
                user.verified = 1
                user.save()
            }
            //created user
            if ( !user ) {
                user = User.create( {
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
                    throw new HttpException( "User account couldn't be created" )
                }
            }

            const tokenData = this.generateJwtToken( user )
            return { ...tokenData, user }
        }

        throw new HttpException( 'Email address was not verified', 401 )
    }

    public async forgotPassword( req: Request ): Promise<void> {
        const { email } = req.body

        let resetToken  = crypto.randomBytes( 16 ).toString( 'hex' )
        resetToken      = `${ resetToken }.${ encrypt( email ) }`
        const resetLink = `${ process.env.CLIENT_URL }/auth/reset_password/${ resetToken }`

        const user = await User.findOne( { email } )
        if ( !user ) {
            throw new HttpException( 'User not found with the email' )
        }
        const verification = await Verification.findOne( { username: user.username } )

        if ( !verification ) {
            const createVerification = await Verification.create( {
                token: resetToken,
                username: user.username
            } )
            await createVerification.save()
        } else {
            verification.token = resetToken
            await verification.save()
        }

        const subject = `${ user.username }, we've made it easy to get back on ${ process.env.APP_NAME }`
        const html    = `
                <div>
                    <p style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">Hi ${ user.username },</p>
                    </br>
                    </br>
                    <div>
                        <p>Sorry to hear you’re having trouble logging into ${ process.env.APP_NAME }. </p>
                        <p>We got a message that you forgot your password.</p>
                        <p>If this was you, you can reset your password now.</p>
                    </div>
                    </br>
                    <div><a href="${ resetLink }">Reset your password</a></div>
                </div>
            `

        await sendEmail( email, subject, html )
    }

    public async tokenVerify( token: string ): Promise<User> {
        if ( token.indexOf( '.' ) === -1 ) {
            throw new HttpException( 'The token is not valid!', 422 )
        }

        const encryptedEmail: string = token.split( '.' )[1]
        const email: string          = decrypt( encryptedEmail )

        const user         = await User.findOne( { email } )
        const verification = await Verification.findOne( { username: user?.username } )

        if ( user && verification?.token === token ) {
            return user
        }

        throw new HttpException( 'The token is not valid!', 422 )
    }

    private generateJwtToken( user: User ): TokenData {
        const dataStoredInToken = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            photo: user.photo
        }
        const secretKey: string = process.env.JWT_SECRET!
        const expiresIn: number = Number( process.env.JWT_EXPIRY! ) || 3600

        let access_token = jwt.sign( dataStoredInToken, secretKey, { expiresIn } )

        return { access_token, expiresIn, token_type: 'Bearer' }
    }
}

export default AuthService