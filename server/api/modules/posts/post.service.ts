import { Request } from "express"
import path from "path"
import { v4 as uuid } from "uuid"
import { UploadedFile } from "express-fileupload"

import Post from "@entities/Post"
import Like from "@entities/Like"
import { paginateMeta } from "@utils/paginateMeta"
import { PaginateMeta } from "@api/types/index.types"
import { appDataSource } from "@config/data-source.config"
import Media from "@entities/Media"
import { PhotoSource } from "@api/enums"

export default class PostService {
    private postRepository = appDataSource.getRepository(Post)

    public async getManyPost(req: Request): Promise<{ posts: Post[], meta: PaginateMeta }> {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 6
        const skip = limit * (page - 1)

        const [posts, count] = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .loadRelationCountAndMap('post.commentCount', 'post.comments')
            .leftJoinAndSelect('post.likes', 'like')
            .loadRelationCountAndMap('post.likeCount', 'post.likes')
            .orderBy('post.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        //check and set current user like
        for (let post of posts) {
            const like = await Like.findOneBy({ userId: req.user.id, postId: post.id })
            post.hasCurrentUserLike = like ? true : false
        }

        return { posts, meta: paginateMeta(count, page, limit) }
    }


    public async getFeedPosts(req: Request): Promise<{ posts: Post[], meta: PaginateMeta }> {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 6
        const skip = limit * (page - 1)

        const [posts, count] = await this.postRepository
            .createQueryBuilder('post')
            .where('post.userId != :userId', { userId: req.user.id })
            .leftJoinAndSelect('post.user', 'user')
            .loadRelationCountAndMap('post.commentCount', 'post.comments')
            .leftJoinAndSelect('post.likes', 'like')
            .loadRelationCountAndMap('post.likeCount', 'post.likes')
            .orderBy('post.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        //check and set current user like
        for (let post of posts) {
            const like = await Like.findOneBy({ userId: req.user.id, postId: post.id })
            post.hasCurrentUserLike = like ? true : false
        }

        return { posts, meta: paginateMeta(count, page, limit) }
    }

    public async createPost(req: Request): Promise<Post> {
        const { body } = req.body

        const image = req.files?.image as UploadedFile

        if (!body && !image) {
            throw new Error('Input field missing')
        }

        try {
            if (image) {
                const imageName = process.env.APP_NAME + '_image_' + uuid() + path.extname(image.name)
                const imageUrl = `${process.env.SERVER_URL}/images/${imageName}`
                const imagePath = path.resolve(process.cwd(), 'server/public/images', imageName)
                await image.mv(imagePath)

                //save post
                const post = new Post()
                post.userId = req.user.id
                post.body = body
                post.photo = imageUrl
                const savedPost = await this.postRepository.save(post)

                //save photo
                const media = new Media()
                media.userId = req.user.id
                media.sourceId = post.id
                media.source = PhotoSource.POST
                media.name = image.name
                media.type = image.mimetype
                media.url = imageUrl
                await media.save()

                return savedPost
            }

            //save post
            const post = new Post()
            post.userId = req.user.id
            post.body = body

            return await this.postRepository.save(post)
        } catch (err) {
            throw new Error('Post couldn\'t be created.')
        }
    }

    public async like(req: Request): Promise<Like> {
        const {postId} = req.params

        if (!postId) throw new Error('Post id missing')

        try {
            const like = new Like()
            like.postId = postId
            like.userId = req.user.id

            return await like.save()
        } catch (err) {
            throw new Error('The post couldn\'t be liked.')
        }
    }

    public async unlike(req: Request): Promise<void> {
        const {postId} = req.params

        if (!postId) throw new Error('Post id missing')

        try {
            await Like.delete({ postId, userId: req.user.id })
        } catch (err) {
            throw new Error('The post couldn\'t be unliked.')
        }
    }
}