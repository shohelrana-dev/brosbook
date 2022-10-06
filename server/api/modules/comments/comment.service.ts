import { Request }       from "express"
import Comment           from "@entities/Comment"
import Like              from "@entities/Like"
import { paginateMeta }  from "@utils/paginateMeta"
import { PaginateMeta }  from "@api/types/index.types"
import { AppDataSource } from "@config/data-source.config"
import User              from "@entities/User"

export default class CommentService {
    private commentRepository = AppDataSource.getRepository( Comment )

    public async getMany( req: Request ): Promise<{ comments: Comment[], meta: PaginateMeta }>{
        const postId = req.params.postId
        const page   = Number( req.query.page ) || 1
        const limit  = Number( req.query.limit ) || 5
        const skip   = limit * ( page - 1 )

        const [comments, count] = await this.commentRepository
            .createQueryBuilder( 'comment' )
            .leftJoinAndSelect( 'comment.user', 'user' )
            .loadRelationCountAndMap( 'comment.likeCount', 'comment.likes' )
            .where( 'comment.postId = :postId', { postId } )
            .orderBy( 'comment.createdAt', 'DESC' )
            .skip( skip )
            .take( limit )
            .getManyAndCount()

        //check and set current user like
        if( req.isAuthenticated ){
            for ( let comment of comments ) {
                const like                 = await Like.findOneBy( { userId: req.user?.id, commentId: comment.id } )
                comment.hasCurrentUserLike = like ? true : false
            }
        }

        return { comments, meta: paginateMeta( count, page, limit ) }
    }

    public async create( req: Request ){
        const { content } = req.body
        const postId      = Number( req.params.postId )

        if( ! content ) throw new Error( 'Comment content required.' )

        const comment = Comment.create( {
            userId: req.user.id,
            content,
            postId
        } )

        const createdComment = await comment.save()
        createdComment.user  = await User.findOneBy( { id: req.user.id } )

        return createdComment
    }

    public async like( req: Request ){
        const commentId = Number( req.params.commentId )

        const like = Like.create( { commentId, userId: req.user.id } )

        return await like.save()

    }

    public async unlike( req: Request ){
        const commentId = Number( req.params.commentId )

        await Like.delete( { commentId, userId: req.user.id } )
    }
}