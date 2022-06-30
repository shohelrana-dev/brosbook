import { Request }       from "express"
import path              from "path"
import { v4 as uuidv4 }  from "uuid"
import { UploadedFile }  from "express-fileupload"
import { getRepository } from "typeorm"

import Post                                         from "@entities/Post"
import Like                                         from "@entities/Like"
import HttpException                                from "@exceptions/http.exception"
import { HTTP_CONFLICT, HTTP_UNPROCESSABLE_ENTITY } from "@utils/httpStatusCodes"
import { paginateMeta }                             from "@api/utils"
import { PaginateMeta }                             from "@interfaces/index.interfaces";

export default class PostService {

    public async getPosts( req: Request ): Promise<{ posts: Post[], meta: PaginateMeta }> {
        const page  = Number( req.query.page ) || 1
        const limit = Number( req.query.limit ) || 6
        const skip  = limit * ( page - 1 )

        try {
            const [ posts, count ] = await getRepository( Post )
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
                const like              = await Like.findOne( { username: req.user.username, postId: post.id } )
                post.hasCurrentUserLike = like ? true : false
            }

            return { posts, meta: paginateMeta( count, page, limit ) }
        } catch ( e ) {
            throw new HttpException( "posts couldn't be fetched", HTTP_CONFLICT )
        }
    }

    public async createPost( req: Request ) {
        const { content } = req.body

        const image = req.files?.image as UploadedFile

        if ( !content && !image ) {
            throw new HttpException( 'Input field missing', HTTP_UNPROCESSABLE_ENTITY )
        }

        let imageUrl
        if ( image ) {
            const imageName = process.env.APP_NAME + '_image_' + uuidv4() + path.extname( image.name )
            imageUrl        = `${ process.env.SERVER_URL }/images/${ imageName }`
            const imagePath = path.resolve( process.cwd(), 'public/images', imageName )
            await image.mv( imagePath )
        }


        const post = Post.create( {
            username: req.user.username,
            content: content,
            photo: imageUrl
        } )

        try {
            await post.save()
        } catch ( err ) {
            err.message = "Post couldn't be saved"
            err.status  = HTTP_CONFLICT
            throw err
        }

    }

    public async saveLike( req: Request ) {
        const postId = Number( req.params.postId )

        if ( !postId ) throw new HttpException( 'Post id missing', HTTP_CONFLICT )

        const like = Like.create( { postId, username: req.user.username } )

        try {
            await like.save()
        } catch ( err ) {
            throw new HttpException( "Like couldn't be save" )
        }
    }

    public async removeLike( req: Request ) {
        const postId = Number( req.params.postId )

        if ( !postId ) throw new HttpException( 'Post id missing', HTTP_CONFLICT )

        try {
            await Like.delete( { postId, username: req.user.username } )
        } catch ( err ) {
            throw new HttpException( "Like couldn't be remove" )
        }
    }
}