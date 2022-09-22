import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import SettingService       from "./setting.service"

export default class SettingController {
    constructor( private readonly settingsService: SettingService ) {
    }

    public updateProfile = async ( req: Request, res: Response, next: NextFunction ) => {
        //check errors
        const errors = validationResult( req )
        if ( !errors.isEmpty() ) {
            return res.status( 422 ).json( {
                success: false,
                message: 'Please fix the errors below.',
                errors: errors.mapped()
            } )
        }

        try {
            const user = await this.settingsService.updateProfile( req )

            return res.json( {
                success: true,
                message: 'User profile has been updated',
                user
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public changePassword = async ( req: Request, res: Response, next: NextFunction ) => {
        //check errors
        const errors = validationResult( req )
        if ( !errors.isEmpty() ) {
            return res.status( 422 ).json( {
                success: false,
                message: 'Please fix the errors below.',
                errors: errors.mapped()
            } )
        }

        try {
            await this.settingsService.changePassword( req )

            return res.json( {
                success: true,
                message: 'Password has been changed successfully.'
            } )
        } catch ( err ) {
            return next( err )
        }
    }
}