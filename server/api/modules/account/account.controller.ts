import { NextFunction, Request, Response } from "express"
import AccountService                      from "./account.service"

export default class AccountController {
    constructor( private readonly accountService: AccountService ){
    }

    public updateProfile = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const user = await this.accountService.updateProfile( req.body, req.auth )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public changeUsername = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const user = await this.accountService.changeUsername( req.body, req.auth )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public changePassword = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const user = await this.accountService.changePassword( req.body, req.auth )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }
}