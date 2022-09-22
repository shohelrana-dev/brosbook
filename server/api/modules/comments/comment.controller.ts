import { NextFunction, Request, Response } from "express"
import CommentService                      from "@services/comment.service"

export default class CommentController {
    constructor( private readonly commentService: CommentService ){
    }

    public getComments = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { comments, meta } = await this.commentService.getComments( req )

            return res.json( {
                success: true,
                comments,
                meta
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public create = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const comment = await this.commentService.createComment( req )

            return res.status( 201 ).json( {
                success: true,
                message: 'Comment has been created',
                comment
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public like = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.commentService.like( req )

            return res.status( 200 ).json( {
                success: true,
                message: 'The comment has been liked'
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public unlike = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.commentService.unlike( req )

            return res.status( 200 ).json( {
                success: true,
                message: 'The comment has been unliked'
            } )
        } catch ( err ) {
            return next( err )
        }
    }

}