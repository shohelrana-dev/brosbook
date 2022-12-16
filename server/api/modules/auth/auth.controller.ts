import { NextFunction, Request, Response } from "express"
import AuthService                         from "./auth.service"

class AuthController {

    constructor( private readonly authService: AuthService ){}

    public signup = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            //create the user
            const user = await this.authService.signup( req.body )

            //send success response
            res.status( 201 ).json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public login = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            //attempt login
            const loginData = await this.authService.login( req.body )


            res.json( loginData )
        } catch ( err ) {
            next( err )
        }
    }

    public loginWithGoogle = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const loginData = await this.authService.loginWithGoogle( req.body.token )

            res.json( loginData )
        } catch ( err ) {
            next( err )
        }
    }

    public forgotPassword = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            await this.authService.forgotPassword( req.body.email )

            res.json( { message: `We've sent an email to ${ req.body.email } with a link to get back into your account.` } )
        } catch ( err ) {
            next( err )
        }
    }

    public resetPassword = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            await this.authService.resetPassword( { ...req.body, token: req.params.token } )

            res.json( { message: 'Password has been changed' } )
        } catch ( err ) {
            next( err )
        }
    }

    public verifyEmail = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const user = await this.authService.verifyEmail( req.params.token )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public resendEmailVerificationLink = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            await this.authService.resendEmailVerificationLink( req.body.email )

            res.json( { message: 'Success resending email' } )
        } catch ( err ) {
            next( err )
        }
    }
}

export default AuthController