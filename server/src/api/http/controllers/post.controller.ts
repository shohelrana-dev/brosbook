import { NextFunction, Request, Response } from "express"
import PostService                         from "@services/post.service"

export default class PostController {
    constructor( private readonly postService: PostService ) {
    }

    public getPosts = async ( req: Request, res: Response, next: NextFunction ) => {
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

    public createPost = async ( req: Request, res: Response, next: NextFunction ) => {
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

    public saveLike = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.postService.saveLike( req )

            return res.status( 201 ).json( {
                success: true,
                message: 'Like has been saved'
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public deleteLike = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.postService.removeLike( req )

            return res.status( 202 ).json( {
                success: true,
                message: 'Like has been removed'
            } )
        } catch ( err ) {
            return next( err )
        }
    }

}