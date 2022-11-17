import { NextFunction, Request, Response } from "express"
import UserService from "./user.service"

export default class UserController {
    constructor( private readonly usersService: UserService ){
    }

    public getCurrentUser = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.getCurrentUser(req)

            res.json( user)
        } catch ( err ) {
            next( err )
        }
    }

    public getUserByUsername = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.getUserByUsername(req )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public getSearchUsers = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { users, meta } = await this.usersService.getSearchUsers( req )

            res.json( { items: users, ...meta } )
        } catch ( err ) {
            next( err )
        }
    }

    public getSuggestedUsers = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { users, meta } = await this.usersService.getSuggestedUsers( req )

            res.json( { items: users, ...meta } )
        } catch ( err ) {
            next( err )
        }
    }

    public getUserPosts = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { posts, meta } = await this.usersService.getUserPosts( req )

            res.json( { items: posts, ...meta } )
        } catch ( err ) {
            next( err )
        }
    }


    public getFollowing = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { following, meta } = await this.usersService.getFollowing( req )

            res.json( { items: following, ...meta } )
        } catch ( err ) {
            next( err )
        }
    }

    public getFollowers = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { followers, meta } = await this.usersService.getFollowers( req )

            res.json( { items: followers, ...meta } )
        } catch ( err ) {
            next( err )
        }
    }

    public changeProfilePhoto = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.changeProfilePhoto( req )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public changeCoverPhoto = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.changeCoverPhoto( req )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public follow = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const following = await this.usersService.follow( req )

            res.json( following )
        } catch ( err ) {
            next( err )
        }
    }

    public unfollow = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.usersService.unfollow( req )

            res.json( { message: 'Unfollow success.' } )
        } catch ( err ) {
            next( err )
        }
    }

}