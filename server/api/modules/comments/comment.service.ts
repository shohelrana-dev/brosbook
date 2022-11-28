import { Request } from "express"
import Comment from "@entities/Comment"
import Like from "@entities/Like"
import { paginateMeta } from "@utils/paginateMeta"
import { PaginateMeta } from "@api/types/index.types"
import { appDataSource } from "@config/data-source.config"
import User from "@entities/User"

export default class CommentService {
    private commentRepository = appDataSource.getRepository(Comment)

    public async getMany(req: Request): Promise<{ comments: Comment[], meta: PaginateMeta }> {
        const postId = req.params.postId
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const skip = limit * (page - 1)

        const [comments, count] = await this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
            .where('comment.postId = :postId', { postId })
            .orderBy('comment.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        //check and set current user like
        if (req.auth.isAuthenticated) {
            for (let comment of comments) {
                const like = await Like.findOneBy({ userId: req.auth.user?.id, commentId: comment.id })
                comment.isViewerLiked = like ? true : false
            }
        }

        return { comments, meta: paginateMeta(count, page, limit) }
    }

    public async create(req: Request) {
        const { body } = req.body
        const postId = req.params.postId

        if (!postId) throw new Error('Post id missing.')
        if (!body) throw new Error('Comment body not be empty.')

        try {
            const comment = new Comment()
            comment.userId = req.auth.user.id
            comment.body = body
            comment.postId = postId

            const savedComment = await comment.save()
            savedComment.user = await User.findOneBy({ id: req.auth.user.id })

            return savedComment
        } catch (err) {
            throw new Error('Comment couldn\'t be created.')
        }
    }

    public async like(req: Request) {
        const { commentId } = req.params

        if (!commentId) throw new Error('Comment id missing.')

        try {
            const like = Like.create({ commentId, userId: req.auth.user.id })
            return await like.save()
        } catch (err) {
            throw new Error('The Comment couldn\'t be liked.')
        }

    }

    public async unlike(req: Request) {
        const { commentId } = req.params

        if (!commentId) throw new Error('Comment id missing.')

        try {
            await Like.delete({ commentId, userId: req.auth.user.id })
        } catch (error) {
            throw new Error('The Comment couldn\'t be unliked.')
        }
    }
}