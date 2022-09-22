import { NextFunction, Request, Response } from "express"
import UsersService                        from "./users.service"

export default class UsersController {
    constructor( private readonly usersService: UsersService ){
    }

    public getSuggestedUsers = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { users, meta } = await this.usersService.getSuggestedUsers( req )

            res.json( { success: true, users, meta } )
        } catch ( err ) {
            next( err )
        }
    }

    public getUser = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.getUser( req )

            res.json( { success: true, user } )
        } catch ( err ) {
            next( err )
        }
    }

    public getPosts = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { posts, meta } = await this.usersService.getPosts( req )

            res.json( { success: true, posts, meta } )
        } catch ( err ) {
            next( err )
        }
    }


    public getFollowing = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { following, meta } = await this.usersService.getFollowing( req )

            res.json( { success: true, following, meta } )
        } catch ( err ) {
            next( err )
        }
    }

    public getFollowers = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { followers, meta } = await this.usersService.getFollowers( req )

            res.json( { success: true, followers, meta } )
        } catch ( err ) {
            next( err )
        }
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