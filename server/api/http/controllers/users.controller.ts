import { NextFunction, Request, Response } from "express"
import UsersService                        from "@services/users.service"

export default class UsersController {
    constructor( private readonly usersService: UsersService ){
    }

    public follow = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const following = await this.usersService.follow( req )

            res.json( {
                success: true,
                following,
                message: 'Following successfully'
            } )
        } catch ( err ) {
            next( err )
        }
    }

    public unfollow = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const following = await this.usersService.unfollow( req )

            res.json( {
                success: true,
                following,
                message: 'Unfollowing successfully'
            } )
        } catch ( err ) {
            next( err )
        }
    }

}