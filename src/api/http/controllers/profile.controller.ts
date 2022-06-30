import { NextFunction, Request, Response } from "express"
import ProfileService                      from "@services/profile.service"

export default class ProfileController {
    constructor( private readonly profileService: ProfileService ) {
    }

    public getSuggestedUsers = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { users, meta } = await this.profileService.getSuggestedUsers( req )

            res.json( { success: true, users, meta } )
        } catch ( err ) {
            next( err )
        }
    }

    public getUser = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.profileService.getUser( req )

            res.json( { success: true, user } )
        } catch ( err ) {
            next( err )
        }
    }

    public getPosts = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { posts, meta } = await this.profileService.getPosts( req )

            res.json( { success: true, posts, meta } )
        } catch ( err ) {
            next( err )
        }
    }


    public getFollowing = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { following, meta } = await this.profileService.getFollowing( req )

            res.json( { success: true, following, meta } )
        } catch ( err ) {
            next( err )
        }
    }

    public getFollowers = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { followers, meta } = await this.profileService.getFollowers( req )

            res.json( { success: true, followers, meta } )
        } catch ( err ) {
            next( err )
        }
    }

}