import { NextFunction, Request, Response } from "express"
import FollowService                       from "@services/follow.service"

export default class FollowController {
    constructor( private readonly followService: FollowService ) {
    }

    public addFollowing = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const following = await this.followService.addFollowing( req )

            res.json( {
                success: true,
                following,
                message: 'Following successfully'
            } )
        } catch ( err ) {
            next( err )
        }
    }

    public removeFollowing = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const following = await this.followService.removeFollowing( req )

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