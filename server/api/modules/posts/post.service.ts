import { Request }      from "express"
import path             from "path"
import { v4 as uuid }   from "uuid"
import { UploadedFile } from "express-fileupload"

import Post              from "@api/entities/Post"
import Like              from "@api/entities/Like"
import { paginateMeta }  from "@utils/paginateMeta"
import { PaginateMeta }  from "@api/types/index.types"
import { appDataSource } from "@config/data-source.config"
import Media             from "@api/entities/Media"
import { PhotoSource }   from "@api/enums";

export default class PostService {
    private postRepository = appDataSource.getRepository( Post )

    public async getManyPost( req: Request ): Promise<{ posts: Post[], meta: PaginateMeta }>{
        const page  = Number( req.query.page ) || 1
        const limit = Number( req.query.limit ) || 6
        const skip  = limit * ( page - 1 )

        const [posts, count] = await this.postRepository
            .createQueryBuilder( 'post' )
            .leftJoinAndSelect( 'post.user', 'user' )
            .loadRelationCountAndMap( 'post.commentCount', 'post.comments' )
            .leftJoinAndSelect( 'post.likes', 'like' )
            .loadRelationCountAndMap( 'post.likeCount', 'post.likes' )
            .orderBy( 'post.createdAt', 'DESC' )
            .skip( skip )
            .take( limit )
            .getManyAndCount()

        //check and set current user like
        for ( let post of posts ) {
            const like              = await Like.findOneBy( { userId: req.user.id, postId: post.id } )
            post.hasCurrentUserLike = like ? true : false
        }

        return { posts, meta: paginateMeta( count, page, limit ) }
    }


    public async getFeedPosts( req: Request ): Promise<{ posts: Post[], meta: PaginateMeta }>{
        const page  = Number( req.query.page ) || 1
        const limit = Number( req.query.limit ) || 6
        const skip  = limit * ( page - 1 )

        const [posts, count] = await this.postRepository
            .createQueryBuilder( 'post' )
            .where( 'post.userId != :userId', { userId: req.user.id } )
            .leftJoinAndSelect( 'post.user', 'user' )
            .loadRelationCountAndMap( 'post.commentCount', 'post.comments' )
            .leftJoinAndSelect( 'post.likes', 'like' )
            .loadRelationCountAndMap( 'post.likeCount', 'post.likes' )
            .orderBy( 'post.createdAt', 'DESC' )
            .skip( skip )
            .take( limit )
            .getManyAndCount()

        //check and set current user like
        for ( let post of posts ) {
            const like              = await Like.findOneBy( { userId: req.user.id, postId: post.id } )
            post.hasCurrentUserLike = like ? true : false
        }

        return { posts, meta: paginateMeta( count, page, limit ) }
    }

    public async createPost( req: Request ): Promise<Post>{
        const { body } = req.body

        const image = req.files?.image as UploadedFile

        if( ! body && ! image ){
            throw new Error( 'Input field missing' )
        }

        if( image ){
            const imageName = process.env.APP_NAME + '_image_' + uuid() + path.extname( image.name )
            const imageUrl  = `${ process.env.SERVER_URL }/images/${ imageName }`
            const imagePath = path.resolve( process.cwd(), 'server/public/images', imageName )
            await image.mv( imagePath )

            const post = await Post.create( {
                userId: req.user.id,
                body: body,
                Media: imageUrl
            } ).save()

            await Media.create( {
                userId: req.user.id,
                sourceId: post.id,
                source: PhotoSource.POST,
                name: image.name,
                type: image.mimetype,
                url: imageUrl
            } ).save()

            return post
        }


        return await Post.create( {
            userId: req.user.id,
            body: body
        } ).save()
    }

    public async like( req: Request ): Promise<Like>{
        const postId = Number( req.params.postId )

        if( ! postId ) throw new Error( 'Post id missing' )

        const like = Like.create( { postId, userId: req.user.id } )

        try {
            return await like.save()
        } catch ( err ) {
            throw new Error( "The post couldn't be like" )
        }
    }

    public async unlike( req: Request ): Promise<void>{
        const postId = Number( req.params.postId )

        if( ! postId ) throw new Error( 'Post id missing' )

        try {
            await Like.delete( { postId, userId: req.user.id } )
        } catch ( err ) {
            throw new Error( "The post couldn't be unlike" )
        }
    }
}