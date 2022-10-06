import { NextFunction, Request, Response } from "express"
import PostService                         from "./post.service"
import HttpException                       from "@exceptions/http.exception"
import httpStatus                          from "http-status"

export default class PostController {
    constructor( private readonly postService: PostService ){
    }

    public getManyPost = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const { posts, meta } = await this.postService.getManyPost( req )

            res.json( { items: posts, ...meta } )
        } catch ( err ) {
            next( new HttpException( httpStatus.CONFLICT, err.message ) )
        }
    }

    public getFeedPosts = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const { posts, meta } = await this.postService.getFeedPosts( req )

            res.json( { items: posts, ...meta } )
        } catch ( err ) {
            next( new HttpException( httpStatus.CONFLICT, err.message ) )
        }
    }

    public createPost = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const post = await this.postService.createPost( req )

            res.status( httpStatus.CREATED ).json( post )
        } catch ( err ) {
            next( new HttpException( httpStatus.CONFLICT, err.message ) )
        }
    }

    public like = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const like = await this.postService.like( req )

            res.json( like )
        } catch ( err ) {
            next( new HttpException( httpStatus.CONFLICT, err.message ) )
        }
    }

    public unlike = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const unlike = await this.postService.unlike( req )

            res.json( { message: 'Unlike success' } )
        } catch ( err ) {
            next( new HttpException( httpStatus.CONFLICT, err.message ) )
        }
    }

}