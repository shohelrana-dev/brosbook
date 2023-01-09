import { UploadedFile } from "express-fileupload"
import isEmpty from "is-empty"
import Post from "@entities/Post"
import PostLike from "@entities/PostLike"
import { paginateMeta } from "@utils/paginateMeta"
import { Auth, ListResponse, PostsQueryParams } from "@api/types/index.types"
import { MediaSource } from "@entities/Media"
import NotFoundException from "@exceptions/NotFoundException"
import Relationship from "@entities/Relationship"
import BadRequestException from "@exceptions/BadRequestException"
import MediaService from "@services/media.service"
import User from "@entities/User"
import { appDataSource } from "@config/data-source.config"
import Comment from "@entities/Comment"
import NotificationService from "@modules/notifications/notification.service"
import { NotificationTypes } from "@entities/Notification";

export default class PostService {
    public readonly repository          = appDataSource.getRepository( Post )
    public readonly likeRepository      = appDataSource.getRepository( PostLike )
    public readonly mediaService        = new MediaService()
    public readonly notificationService = new NotificationService()

    public async create( postData: { body?: string, image: UploadedFile }, auth: Auth ): Promise<Post>{
        if( isEmpty( postData ) ) throw new BadRequestException( 'Post data is empty.' )

        const { image, body } = postData

        if( image ){
            //save image
            const savedImage = await this.mediaService.save( {
                file: image,
                creator: auth.user,
                source: MediaSource.POST
            } )

            //save post
            const post  = new Post()
            post.author = auth.user as User
            post.image  = savedImage
            post.body   = body

            return await this.repository.save( post )
        }

        //save post
        const post  = new Post()
        post.author = auth.user as User
        post.body   = body

        return await this.repository.save( post )
    }

    public async getPostById( postId: string, auth: Auth ): Promise<Post>{
        if( ! postId ) throw new BadRequestException( "Post id is empty." )

        const post = await this.repository.findOneBy( { id: postId } )

        if( ! post ) throw new NotFoundException( 'Post doesn\'t exists.' )

        await post.setViewerProperties( auth )

        return post
    }

    public async delete( postId: string ): Promise<Post>{
        if( ! postId ) throw new BadRequestException( "Post id is empty." )

        const post = await this.repository.findOneBy( { id: postId } )

        if( ! post ) throw new NotFoundException( 'Post doesn\'t exists.' )

        await post.remove()

        await appDataSource.getRepository( Comment ).delete( { post: { id: post.id } } )

        return post
    }

    public async getMany( params: PostsQueryParams, auth: Auth ): Promise<ListResponse<Post>>{
        if( params.userId ){
            return await this.getUserPosts( params, auth )
        }

        const page  = params.page || 1
        const limit = params.limit || 6
        const skip  = limit * ( page - 1 )

        const [posts, count] = await this.repository
            .createQueryBuilder( 'post' )
            .leftJoinAndSelect( 'post.author', 'author' )
            .leftJoinAndSelect( 'author.avatar', 'avatar' )
            .leftJoinAndSelect( 'post.image', 'image' )
            .orderBy( 'post.createdAt', 'DESC' )
            .skip( skip )
            .take( limit )
            .getManyAndCount()

        const formattedPosts = await Promise.all( posts.map( post => post.setViewerProperties( auth ) ) )

        return { items: formattedPosts, ...paginateMeta( count, page, limit ) }
    }

    public async getUserPosts( params: PostsQueryParams, auth: Auth ): Promise<ListResponse<Post>>{
        const userId = params.userId
        const page   = params.page || 1
        const limit  = params.limit || 6
        const skip   = limit * ( page - 1 )

        if( ! userId ) throw new BadRequestException( "User id is empty." )

        const user = await User.findOneBy( { id: userId } )
        if( ! user ) throw new BadRequestException( "User doesn't exists." )

        const [posts, count] = await this.repository
            .createQueryBuilder( 'post' )
            .leftJoinAndSelect( 'post.author', 'author' )
            .leftJoinAndSelect( 'author.avatar', 'avatar' )
            .leftJoinAndSelect( 'post.image', 'image' )
            .where( 'author.id = :authorId', { authorId: userId } )
            .orderBy( 'post.createdAt', 'DESC' )
            .skip( skip )
            .take( limit )
            .getManyAndCount()

        const formattedPosts = await Promise.all( posts.map( ( post => post.setViewerProperties( auth ) ) ) )

        return { items: formattedPosts, ...paginateMeta( count, page, limit ) }
    }


    public async getFeedPosts( params: PostsQueryParams, auth: Auth ): Promise<ListResponse<Post>>{
        const page  = params.page || 1
        const limit = params.limit || 6
        const skip  = limit * ( page - 1 )

        const relationships = await Relationship.findBy( { follower: { id: auth.user.id } } )

        let followingAuthorIds = relationships.map( rel => rel.following.id )

        const [posts, count] = await this.repository
            .createQueryBuilder( 'post' )
            .leftJoinAndSelect( 'post.author', 'author' )
            .leftJoinAndSelect( 'author.avatar', 'avatar' )
            .leftJoinAndSelect( 'post.image', 'image' )
            .where( 'author.id != :authorId', { authorId: auth.user.id } )
            .andWhere( 'author.id IN (:authorIds)', { authorIds: followingAuthorIds } )
            .orderBy( 'post.createdAt', 'DESC' )
            .skip( skip )
            .take( limit )
            .getManyAndCount()

        const formattedPosts = await Promise.all( posts.map( post => post.setViewerProperties( auth ) ) )

        return { items: formattedPosts, ...paginateMeta( count, page, limit ) }
    }

    public async like( postId: string, auth: Auth ): Promise<Post>{
        if( ! postId ) throw new BadRequestException( "Post id is empty." )

        const post = await this.repository.findOneBy( { id: postId } )

        if( ! post ) throw new BadRequestException( 'Post doesn\'t exists.' )

        const like = new PostLike()
        like.post  = post
        like.user  = auth.user as User
        await this.likeRepository.save( like )

        this.updatePostLikesCount( post )

        post.isViewerLiked = true
        post.likesCount    = Number( post.likesCount ) + 1

        this.notificationService.create( {
            initiatorId: auth.user.id,
            recipientId: post.author.id,
            type: NotificationTypes.LIKED_POST,
            postId
        } )

        return post
    }

    public async unlike( postId: string, auth: Auth ): Promise<Post>{
        if( ! postId ) throw new BadRequestException( "Post id is empty." )

        const post = await this.repository.findOneBy( { id: postId } )

        if( ! post ) throw new BadRequestException( 'Post doesn\'t exists.' )

        await this.likeRepository.delete( { post: { id: post.id }, user: { id: auth.user.id } } )

        this.updatePostLikesCount( post )

        post.isViewerLiked = false
        post.likesCount    = Number( post.likesCount ) - 1

        return post
    }

    private updatePostLikesCount( post: Post ){
        this.likeRepository.countBy( { post: { id: post.id } } ).then( ( count ) => {
            this.repository.update( { id: post.id }, { likesCount: count } )
        } )
    }
}