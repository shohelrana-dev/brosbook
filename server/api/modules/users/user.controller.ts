import { NextFunction, Request, Response } from "express"
import UserService                         from "./user.service"
import HttpException                       from "@exceptions/http.exception"
import httpStatus                          from "http-status"

export default class UserController {
    constructor( private readonly usersService: UserService ){
    }

    public getSearchUsers = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { users, meta } = await this.usersService.getSearchUsers( req )

            res.json( { items: users, ...meta } )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public getOneUser = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const user = await this.usersService.getOneUser( req )

            res.json( user )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public getManyUser = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { users, meta } = await this.usersService.getUserMany( req )

            res.json( { items: users, ...meta } )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public getManyPosts = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { posts, meta } = await this.usersService.getManyPosts( req )

            res.json( { items: posts, ...meta } )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }


    public getFollowing = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { following, meta } = await this.usersService.getFollowing( req )

            res.json( { items: following, ...meta } )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public getFollowers = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { followers, meta } = await this.usersService.getFollowers( req )

            res.json( { items: followers, ...meta } )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public follow = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const following = await this.usersService.follow( req )

            res.json( following )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

    public unfollow = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const following = await this.usersService.unfollow( req )

            res.json( following )
        } catch ( err ) {
            next( new HttpException( httpStatus.BAD_REQUEST, err.message ) )
        }
    }

}