import { Request }      from "express"
import path             from "path"
import { v4 as uuid }   from "uuid"
import { UploadedFile } from "express-fileupload"

import Post              from "@entities/Post"
import Like              from "@entities/Like"
import httpStatus        from "http-status"
import { paginateMeta }  from "@utils/paginateMeta"
import { PaginateMeta }  from "@api/types/index.types"
import { AppDataSource } from "@config/data-source.config";

export default class PostService {
    private postRepository = AppDataSource.getRepository( Post )

    public async getPosts( req: Request ): Promise<{ posts: Post[], meta: PaginateMeta }>{
        const page  = Number( req.query.page ) || 1
        const limit = Number( req.query.limit ) || 6
        const skip  = limit * ( page - 1 )

        try {
            const [posts, count] = await this.postRepository
                .createQueryBuilder( 'post' )
                .where( 'post.username != :username', { username: req.user.username } )
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
        } catch ( e ) {
            throw new Error( "posts couldn't be fetched" )
        }
    }

    public async createPost( req: Request ): Promise<Post>{
        const { content } = req.body

        const image = req.files?.image as UploadedFile

        if( ! content && ! image ){
            throw new Error( 'Input field missing' )
        }

        let imageUrl
        if( image ){
            const imageName = process.env.APP_NAME + '_image_' + uuid() + path.extname( image.name )
            imageUrl        = `${ process.env.SERVER_URL }/images/${ imageName }`
            const imagePath = path.resolve( process.cwd(), 'public/images', imageName )
            await image.mv( imagePath )
        }


        const post = Post.create( {
            userId: req.user.id,
            content: content,
            photo: imageUrl
        } )

        try {
            return await post.save()
        } catch ( err ) {
            err.message = "Post couldn't be saved"
            err.status  = httpStatus.CONFLICT
            throw err
        }

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