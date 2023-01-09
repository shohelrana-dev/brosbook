import { NextFunction, Request, Response } from "express"
import UserService from "./user.service"
import { UploadedFile } from "express-fileupload"

export default class UserController {
    constructor( private readonly usersService: UserService ){
    }

    public getCurrentUser = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.getCurrentUser( req.auth )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public getUserById = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.getUserById( req.params.userId, req.auth )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public getUserByUsername = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.getUserByUsername( req.params.username, req.auth )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public searchUsers = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const users = await this.usersService.searchUsers( req.query as any, req.auth )

            res.json( users )
        } catch ( err ) {
            next( err )
        }
    }

    public getSuggestions = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const users = await this.usersService.getSuggestions( req.query, req.auth )

            res.json( users )
        } catch ( err ) {
            next( err )
        }
    }

    public getFollowings = async( req: Request, res: Response, next: NextFunction ) => {
        const userId = req.params.userId as string
        const page   = Number( req.query.page )
        const limit  = Number( req.query.limit )

        try {
            const followings = await this.usersService.getFollowings( userId, { page, limit }, req.auth )

            res.json( followings )
        } catch ( err ) {
            next( err )
        }
    }

    public getFollowingsCount = async( req: Request, res: Response, next: NextFunction ) => {
        const userId = req.params.userId as string

        try {
            const count = await this.usersService.getFollowingsCount( userId )

            res.json( { count } )
        } catch ( err ) {
            next( err )
        }
    }

    public getFollowers = async( req: Request, res: Response, next: NextFunction ) => {
        const userId = req.params.userId as string
        const page   = Number( req.query.page )
        const limit  = Number( req.query.limit )

        try {
            const followers = await this.usersService.getFollowers( userId, { page, limit }, req.auth )

            res.json( followers )
        } catch ( err ) {
            next( err )
        }
    }


    public getFollowersCount = async( req: Request, res: Response, next: NextFunction ) => {
        const userId = req.params.userId as string

        try {
            const count = await this.usersService.getFollowersCount( userId )

            res.json( { count } )
        } catch ( err ) {
            next( err )
        }
    }

    public changeAvatar = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.changeAvatar( req.files?.avatar as UploadedFile, req.auth )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public changeCoverPhoto = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.changeCoverPhoto( req.files?.coverPhoto as UploadedFile, req.auth )

            res.json( user )
        } catch ( err ) {
            next( err )
        }
    }

    public follow = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const following = await this.usersService.follow( req.params.userId, req.auth )

            res.json( following )
        } catch ( err ) {
            next( err )
        }
    }

    public unfollow = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const unfollowing = await this.usersService.unfollow( req.params.userId, req.auth )

            res.json( unfollowing )
        } catch ( err ) {
            next( err )
        }
    }

}