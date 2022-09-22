import { NextFunction, Request, Response } from "express"
import PostService                         from "./post.service"

export default class PostController {
    constructor( private readonly postService: PostService ){
    }

    public getPosts = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { posts, meta } = await this.postService.getPosts( req )

            return res.json( {
                success: true,
                posts,
                meta
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public createPost = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const post = await this.postService.createPost( req )

            return res.status( 201 ).json( {
                success: true,
                message: 'Post has been published',
                post
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public like = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.postService.like( req )

            return res.status( 201 ).json( {
                success: true,
                message: 'The post has been liked'
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public unlike = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.postService.unlike( req )

            return res.status( 202 ).json( {
                success: true,
                message: 'The post has been unliked'
            } )
        } catch ( err ) {
            return next( err )
        }
    }

}