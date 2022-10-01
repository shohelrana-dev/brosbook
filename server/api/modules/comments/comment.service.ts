import { Request }       from "express"
import Comment           from "@entities/Comment"
import Like              from "@entities/Like"
import HttpException     from "@exceptions/http.exception"
import httpStatus        from "http-status"
import { getRepository } from "typeorm"
import { paginateMeta }  from "@utils/paginateMeta"
import { PaginateMeta }  from "@api/types/index.types"

export default class CommentService {

    public async getComments( req: Request ): Promise<{ comments: Comment[], meta: PaginateMeta }>{
        const postId = req.params.postId
        const page   = Number( req.query.page ) || 1
        const limit  = Number( req.query.limit ) || 5
        const skip   = limit * ( page - 1 )

        if( ! postId ) throw new HttpException( 'Post id missing', httpStatus.CONFLICT )

        const [comments, count] = await getRepository( Comment )
            .createQueryBuilder( 'comment' )
            .leftJoinAndSelect( 'comment.user', 'user' )
            .loadRelationCountAndMap( 'comment.likeCount', 'comment.likes' )
            .where( 'comment.postId = :postId', { postId } )
            .orderBy( 'comment.createdAt', 'DESC' )
            .skip( skip )
            .take( limit )
            .getManyAndCount()

        if( ! Array.isArray( comments ) ) throw new HttpException( "comments couldn't be fetched", httpStatus.CONFLICT )

        //check and set current user like
        for ( let comment of comments ) {
            const like                 = await Like.findOneBy( { username: req.user.username, commentId: comment.id } )
            comment.hasCurrentUserLike = like ? true : false
        }

        return { comments, meta: paginateMeta( count, page, limit ) }
    }

    public async createComment( req: Request ){
        const { content } = req.body
        const postId      = Number( req.query.postId )

        if( ! content && ! postId ) throw new HttpException( 'Input field missing', httpStatus.UNPROCESSABLE_ENTITY )

        const comment = Comment.create( {
            username: req.user.username,
            content,
            postId
        } )

        try {
            const createdComment = await comment.save()
            //@ts-ignore
            createdComment.user  = req.user

            return createdComment
        } catch ( e ) {
            throw new HttpException( "Comment couldn't be created", httpStatus.CONFLICT )
        }
    }

    public async like( req: Request ){
        const commentId = Number( req.params.commentId )

        if( ! commentId ) throw new HttpException( 'Comment id missing' )

        const like = Like.create( { commentId, username: req.user.username } )

        try {
            await like.save()
        } catch ( e ) {
            throw new HttpException( "The comment couldn't be liked", httpStatus.CONFLICT )
        }

    }

    public async unlike( req: Request ){
        const commentId = Number( req.params.commentId )

        if( ! commentId ) throw new HttpException( 'Comment id missing' )

        try {
            await Like.delete( { commentId, username: req.user.username } )
        } catch ( e ) {
            throw new HttpException( "The comment couldn't be unliked", httpStatus.CONFLICT )
        }
    }
}