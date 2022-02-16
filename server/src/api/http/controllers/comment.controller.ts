import { NextFunction, Request, Response } from "express"
import CommentService                      from "@services/comment.service"

export default class CommentController {
    constructor( private readonly commentService: CommentService ) {
    }

    public getComments = async ( req: Request, res: Response, next: NextFunction ) => {
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

    public create = async ( req: Request, res: Response, next: NextFunction ) => {
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

    public saveLike = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.commentService.saveLike( req )

            return res.status( 201 ).json( {
                success: true,
                message: 'Like has been saved'
            } )
        } catch ( err ) {
            return next( err )
        }
    }

    public removeLike = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            await this.commentService.removeLike( req )

            return res.status( 202 ).json( {
                success: true,
                message: 'Like has been saved'
            } )
        } catch ( err ) {
            return next( err )
        }
    }

}