import { NextFunction, Request, Response } from "express"
import httpStatus                          from "http-status"
import AuthService from "./auth.service"

class AuthController {

    constructor( private readonly authService: AuthService ){
    }

    public signup = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            //create the user
            const user = await this.authService.signup( req )

            //send success response
            res.status( httpStatus.CREATED ).json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public login = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            //attempt login
            const loginData = await this.authService.login( req )


            res.json( loginData )
        } catch ( err ) {
            next( err )
        }
    }

    public google = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const loginData = await this.authService.google( req )

            //send success response
            res.json( loginData )

        } catch ( err ) {
            next( err )
        }
    }

    public me = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const user = await this.authService.me( req )

            //send success response
            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public forgotPassword = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const { email } = req.body
            await this.authService.forgotPassword( req )

            res.json( { message: `We've sent an email to ${ email } with a link to get back into your account.` } )
        } catch ( err ) {
            next( err )
        }
    }

    public resetPassword = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            await this.authService.resetPassword( req )

            res.json( { message: 'Password has been changed successfully' } )
        } catch ( err ) {
            next( err )
        }
    }

    public verifyEmail = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const user = await this.authService.verifyEmail( req )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public resendVerificationLink = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            await this.authService.resendVerificationLink( req )

            res.json( { message: 'Sent email success' } )
        } catch ( err ) {
            next( err )
        }
    }
}

export default AuthController