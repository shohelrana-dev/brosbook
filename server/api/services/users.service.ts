import HttpException     from "@exceptions/http.exception"
import { HTTP_CONFLICT } from "@utils/httpStatusCodes"
import { Request }       from "express"
import Follow            from "@entities/Follow"


export default class UsersService {

    public async follow( req: Request ) {
        const username = req.params.username

        if ( !username ) throw new HttpException( 'username is missing', HTTP_CONFLICT )

        const following = Follow.create( { username, followingUsername: req.user.username } )

        try {
            return await following.save()
        } catch ( e ) {
            throw new HttpException( 'Could not be following', HTTP_CONFLICT )
        }
    }

    public async unfollow( req: Request ) {
        const username = req.params.username

        if ( !username ) throw new HttpException( 'username is missing', HTTP_CONFLICT )

        try {
            return await Follow.delete( { username, followingUsername: req.user.username } )
        } catch ( e ) {
            throw new HttpException( 'Could not be unfollowing', HTTP_CONFLICT )
        }
    }

}