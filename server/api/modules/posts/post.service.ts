import path from "path"
import {v4 as uuid} from "uuid"
import {UploadedFile} from "express-fileupload"

import Post from "@entities/Post"
import Like from "@entities/Like"
import {paginateMeta} from "@utils/paginateMeta"
import {Auth, PaginateMeta, PaginateQuery} from "@api/types/index.types"
import {appDataSource} from "@config/data-source.config"
import Media from "@entities/Media"
import {PhotoSource} from "@api/enums"
import NotFoundException from "@exceptions/NotFoundException"
import InternalServerException from "@exceptions/InternalServerException"
import Relationship from "@entities/Relationship"
import formatPost from "@utils/formatPost"
import BadRequestException from "@exceptions/BadRequestException"

export default class PostService {
    private postRepository = appDataSource.getRepository(Post)

    public async create({body, image}: { body?: string, image: UploadedFile }, auth: Auth): Promise<Post> {
        if (!body && !image) {
            throw new Error('Post content not given.')
        }

        try {
            if (image) {
                const imageName = process.env.APP_NAME + '_image_' + uuid() + path.extname(image.name)
                const imageUrl = `${process.env.SERVER_URL}/uploads/${imageName}`
                const imagePath = path.resolve(process.cwd(), 'server/public/uploads', imageName)
                await image.mv(imagePath)

                //save post
                const post = new Post()
                post.authorId = auth.user.id
                post.body = body
                post.photo = imageUrl
                const savedPost = await this.postRepository.save(post)

                //save photo
                const media = new Media()
                media.userId = auth.user.id
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
            post.authorId = auth.user.id
            post.body = body

            return await this.postRepository.save(post)
        } catch (err) {
            throw new Error('Post couldn\'t be created.')
        }
    }

    public async getPostById(id: string, auth: Auth): Promise<Post> {
        try {
            const post = await this.postRepository.findOneOrFail({
                where: {id},
                relations: {author: true}
            })

            return await formatPost(post, auth)
        } catch (e) {
            throw new NotFoundException('Post was not found.')
        }
    }

    public async delete(id: string): Promise<Post> {
        const post = await this.postRepository.findOneBy({id})

        if (!post) throw new NotFoundException('Post was not found.')

        try {
            await this.postRepository.delete({id})
            return post
        } catch (e) {
            throw new InternalServerException('Post couldn\'t be deleted.')
        }
    }

    public async getManyPost(payload: PaginateQuery, auth: Auth): Promise<{ posts: Post[], meta: PaginateMeta }> {
        const page = payload.page || 1
        const limit = payload.limit || 6
        const skip = limit * (page - 1)

        try {
            const [posts, count] = await this.postRepository
                .createQueryBuilder('post')
                .leftJoinAndSelect('post.author', 'user')
                .orderBy('post.createdAt', 'DESC')
                .skip(skip)
                .take(limit)
                .getManyAndCount()

            const formattedPosts = await Promise.all(posts.map((async post => await formatPost(post, auth))))

            return {posts: formattedPosts, meta: paginateMeta(count, page, limit)}
        } catch (e) {
            throw new InternalServerException('Unknown error during database operation.')
        }
    }


    public async getFeedPosts(payload: PaginateQuery, auth: Auth): Promise<{ posts: Post[], meta: PaginateMeta }> {
        const page = payload.page || 1
        const limit = payload.limit || 6
        const skip = limit * (page - 1)

        try {
            const relationships = await Relationship.find({
                where: {followerId: auth.user.id},
            })
            const authorIds = relationships.map(rel => rel.followedId)

            if (authorIds.length > 0) {
                const [posts, count] = await this.postRepository
                    .createQueryBuilder('post')
                    .leftJoinAndSelect('post.author', 'author')
                    .where('post.authorId!=:authorId', {authorId: auth.user.id})
                    .where('post.authorId IN (:authorIds)', {authorIds})
                    .orderBy('post.createdAt', 'DESC')
                    .skip(skip)
                    .take(limit)
                    .getManyAndCount()

                const formattedPosts = await Promise.all(posts.map((async post => await formatPost(post, auth))))

                return {posts: formattedPosts, meta: paginateMeta(count, page, limit)}
            }

            return {posts: [], meta: paginateMeta(0, page, limit)}
        } catch (err) {
            console.log(err)
            throw new InternalServerException('Unknown error during database operation.')
        }
    }

    public async like(postId: string, auth: Auth): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: {id: postId},
            relations: {author: true}
        })

        if (!post) throw new BadRequestException('Post was not found.')

        try {
            const like = new Like()
            like.postId = postId
            like.userId = auth.user.id
            await like.save()

            post.isViewerLiked = true
            post.likeCount = Number(post.likeCount) + 1

            return post
        } catch (err) {
            throw new Error('The post couldn\'t be liked.')
        }
    }

    public async unlike(postId: string, auth: Auth): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: {id: postId},
            relations: {author: true}
        })

        if (!post) throw new BadRequestException('Post was not found.')

        try {
            await Like.delete({postId, userId: auth.user.id})

            post.isViewerLiked = false
            post.likeCount = Number(post.likeCount) - 1

            return post
        } catch (err) {
            throw new Error('The post couldn\'t be unliked.')
        }
    }
}