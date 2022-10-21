import { NextFunction, Request, Response } from "express"
import AccountService from "./account.service"

export default class AccountController {
    constructor(private readonly accountService: AccountService) {
    }

    public updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.accountService.updateProfile(req)

            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.accountService.changePassword(req)

            res.json({ message: 'Password has been changed.' })
        } catch (err) {
            next(err)
        }
    }
}