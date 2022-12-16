import { NextFunction, Request, Response } from "express"
import CommentService                      from "./comment.service"

export default class CommentController {
    constructor( private readonly commentService: CommentService ){
    }

    public getMany = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const comments = await this.commentService.getComments( req.params.postId, req.query, req.auth )

            res.json( comments )
        } catch ( err ) {
            next( err )
        }
    }

    public create = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const comment = await this.commentService.create( {postId: req.params.postId, body: req.body.body}, req.auth )

            res.status( 201 ).json( comment )
        } catch ( err ) {
            next( err )
        }
    }

    public like = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const comment = await this.commentService.like( req.params.commentId, req.auth )

            res.json( comment )
        } catch ( err ) {
            next( err )
        }
    }

    public unlike = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const comment = await this.commentService.unlike( req.params.commentId )

            res.json( comment )
        } catch ( err ) {
            next( err )
        }
    }

}