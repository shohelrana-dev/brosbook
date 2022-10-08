import { NextFunction, Request, Response } from "express"
import CommentService                      from "./comment.service"
import httpStatus from "http-status";
import HttpError  from "@utils/http.error";

export default class CommentController {
    constructor( private readonly commentService: CommentService ){
    }

    public getMany = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const { comments, meta } = await this.commentService.getMany( req )

            res.json( { items: comments, ...meta } )
        } catch ( err ) {
            next( new HttpError( httpStatus.CONFLICT, err.message ) )
        }
    }

    public create = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const comment = await this.commentService.create( req )

            res.status( 201 ).json( comment )
        } catch ( err ) {
            next( new HttpError( httpStatus.CONFLICT, err.message ) )
        }
    }

    public like = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const like = await this.commentService.like( req )

            res.json( like )
        } catch ( err ) {
            next( new HttpError( httpStatus.CONFLICT, err.message ) )
        }
    }

    public unlike = async( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            await this.commentService.unlike( req )

            res.json( { message: 'Unlike success' } )
        } catch ( err ) {
            next( new HttpError( httpStatus.CONFLICT, err.message ) )
        }
    }

}