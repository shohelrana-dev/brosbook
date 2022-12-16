import { NextFunction, Request, Response } from "express"
import PostService from "./post.service"
import {UploadedFile} from "express-fileupload"

export default class PostController {
    constructor( private readonly postService: PostService ){
    }

    public create = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        const body = req.body.body
        const image = req.files?.image as UploadedFile
        const auth = req.auth
        try {
            const post = await this.postService.create( {body, image}, auth )

            res.status( 201 ).json( post )
        } catch ( err ) {
            next(err)
        }
    }

    public getPostById = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const post = await this.postService.getPostById( req.params.id, req.auth )

            res.json( post )
        } catch ( err ) {
            next(err)
        }
    }

    public delete = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const post = await this.postService.delete( req.params.id )

            res.json( post )
        } catch ( err ) {
            next(err)
        }
    }

    public getMany = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const posts = await this.postService.getMany( req.query, req.auth )

            res.json( posts )
        } catch ( err ) {
            next(err)
        }
    }

    public getFeedPosts = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const posts = await this.postService.getFeedPosts( req.query, req.auth )

            res.json( posts )
        } catch ( err ) {
            next(err)
        }
    }

    public like = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const post = await this.postService.like( req.params.postId, req.auth )

            res.json( post )
        } catch ( err ) {
            next(err)
        }
    }

    public unlike = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const post = await this.postService.unlike( req.params.postId, req.auth )

            res.json( post )
        } catch ( err ) {
            next(err)
        }
    }

}