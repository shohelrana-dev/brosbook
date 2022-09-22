import { NextFunction, Request, Response } from "express"
import { validationResult }                from "express-validator"
import cookie                              from "cookie"
import bcrypt                              from "bcrypt"

import User              from "@entities/User"
import HttpException     from "@exceptions/http.exception"
import { HTTP_CONFLICT } from "@utils/httpStatusCodes"
import AuthService       from "./auth.service"

class AuthController {

    constructor( private readonly authService: AuthService ){
    }

    public signup = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            //check errors
            const errors = validationResult( req )
            if( ! errors.isEmpty() ){
                return res.status( 422 ).json( {
                    success: false,
                    message: 'Please fix the errors below.',
                    errors: errors.mapped()
                } )
            }

            //create the user
            let user: User = await this.authService.signup( req )

            //return the created user
            return res.status( 201 ).json( {
                success: true,
                message: 'User signup successfully',
                user
            } )
        } catch ( err ) {
            next( new HttpException( err.message, 500 ) )
        }
    }

    public login = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            //check errors
            const errors = validationResult( req )
            if( ! errors.isEmpty() ){
                return res.status( 422 ).json( {
                    success: false,
                    message: 'Please fix the errors below.',
                    errors: errors.mapped()
                } )
            }

            //get the user
            const tokenData = await this.authService.login( req )

            //set cookie
            res.set( 'Set-Cookie', this.getSerializeTokenCookie( tokenData.access_token ) )

            //return success response
            return res.json( {
                success: true,
                message: 'User has been logged in',
                ...tokenData
            } )
        } catch ( err ) {
            next( new HttpException( err.message, 401 ) )
        }
    }

    public google = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            const tokenData = await this.authService.google( req )

            //set cookie
            res.set( 'Set-Cookie', this.getSerializeTokenCookie( tokenData.access_token ) )

            //return success response
            return res.json( {
                success: true,
                message: 'User has been logged in',
                ...tokenData
            } )

        } catch ( err ) {
            next( new HttpException( err.message, 401 ) )
        }
    }

    public logout = ( _: Request, res: Response ): void => {
        res.set(
            'Set-Cookie',
            cookie.serialize( 'access_token', '', {
                httpOnly: false,
                secure: true,
                sameSite: 'strict',
                expires: new Date( 0 ),
                path: '/',
            } )
        )

        res.json( {
            success: true,
            message: 'User has been logout'
        } )
    }

    public me = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const user = await User.findOneOrFail( {
                where: { username: req.user.username },
                relations: ['profile']
            } )

            res.json( {
                success: true,
                user
            } )
        } catch ( err ) {
            next( new HttpException( 'User could not be found', HTTP_CONFLICT ) )
        }
    }

    public forgotPassword = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            //check errors
            const errors = validationResult( req )
            if( ! errors.isEmpty() ){
                return res.status( 422 ).json( {
                    success: false,
                    message: 'Please fix the input errors below.',
                    errors: errors.mapped()
                } )
            }

            const { email } = req.body
            await this.authService.forgotPassword( req )

            res.json( {
                success: true,
                message: `We've sent an email to ${ email } with a link to get back into your account.`
            } )
        } catch ( err ) {
            next( err )
        }
    }

    public resetPassTokenVerify = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const { token } = req.params

            await this.authService.tokenVerify( token )

            res.json( {
                success: true,
                message: 'The authentication token is valid'
            } )
        } catch ( err ) {
            next( err )
        }
    }

    public resetPassword = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            //check errors
            const errors = validationResult( req )
            if( ! errors.isEmpty() ){
                return res.status( 422 ).json( {
                    success: false,
                    message: 'Input validation error',
                    errors: errors.mapped()
                } )
            }

            const { token }    = req.params
            const { password } = req.body
            const user         = await this.authService.tokenVerify( token )
            user.password      = await bcrypt.hash( password, 6 )
            user.verified      = 1
            await user.save()

            res.json( {
                success: true,
                message: `Password has been changed successfully`
            } )
        } catch ( err ) {
            next( err )
        }
    }

    public verifyAccount = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            const { token } = req.params

            const user = await this.authService.tokenVerify( token )
            if( user.verified === 0 ){
                user.verified = 1
                await user.save()
                res.json( {
                    success: true,
                    message: 'Your account has been verified'
                } )
            } else{
                res.json( {
                    success: true,
                    message: 'Your account already verified'
                } )
            }
        } catch ( err ) {
            next( err )
        }
    }

    private getSerializeTokenCookie = ( token: string ) => {
        return cookie.serialize( 'access_token', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: Number( process.env.JWT_EXPIRY ) || 3600,
            path: '/'
        } )
    }
}

export default AuthController