import HttpException     from "@exceptions/http.exception"
import { HTTP_CONFLICT } from "@utils/httpStatusCodes"
import { Request }       from "express"
import Follow            from "@entities/Follow"


export default class FollowService {

    public async addFollowing( req: Request ) {
        const username = req.params.username

        if ( !username ) throw new HttpException( 'username is missing', HTTP_CONFLICT )

        const following = Follow.create( { username, followingUsername: req.user.username } )

        try {
            return await following.save()
        } catch ( e ) {
            throw new HttpException( 'Could not be following', HTTP_CONFLICT )
        }
    }

    public async removeFollowing( req: Request ) {
        const username = req.params.username

        if ( !username ) throw new HttpException( 'username is missing', HTTP_CONFLICT )

        try {
            return await Follow.delete( { username, followingUsername: req.user.username } )
        } catch ( e ) {
            throw new HttpException( 'Could not be unfollowing', HTTP_CONFLICT )
        }
    }

    public async removeFollower( req: Request ) {
        const username = req.params.username

        if ( !username ) throw new HttpException( 'username is missing', HTTP_CONFLICT )

        try {
            return await Follow.delete( { username: req.user.username, followingUsername: username } )
        } catch ( e ) {
            throw new HttpException( 'Could not be remove follower', HTTP_CONFLICT )
        }
    }

}