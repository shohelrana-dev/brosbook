import { NextFunction, Request, Response } from "express"
import httpStatus                          from "http-status"

import HttpException from "@exceptions/http.exception"
import AuthService   from "./auth.service"

class AuthController {

    constructor( private readonly authService: AuthService ){
    }

    public signup = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            //create the user
            const user = await this.authService.signup( req )

            //return success response
            return res.status( httpStatus.CREATED ).json( user )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public login = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            //attempt login
            const loginData = await this.authService.login( req )

            //return success response
            return res.json( loginData )
        } catch ( err ) {
            next( new HttpException( httpStatus.UNAUTHORIZED, err.message ) )
        }
    }

    public google = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            const loginData = await this.authService.google( req )

            //return success response
            return res.json( loginData )

        } catch ( err ) {
            next( new HttpException( httpStatus.UNAUTHORIZED, err.message ) )
        }
    }

    public me = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            const user = await this.authService.me( req )

            //return success response
            return res.json( user )
        } catch ( err ) {
            next( new HttpException( httpStatus.UNAUTHORIZED, err.message ) )
        }
    }

    public forgotPassword = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            const { email } = req.body
            await this.authService.forgotPassword( req )

            return res.json( { message: `We've sent an email to ${ email } with a link to get back into your account.` } )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public resetPassword = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            await this.authService.resetPassword( req )

            return res.json( { message: 'Password has been changed successfully' } )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public verifyAccount = async( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            const user = await this.authService.verifyAccount( req )

            return res.status( httpStatus.OK ).json( user )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }
}

export default AuthController