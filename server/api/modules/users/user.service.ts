import { Request }       from "express"
import Follow            from "@entities/Follow"
import User              from "@entities/User"
import { paginateMeta }  from "@utils/paginateMeta"
import Post              from "@entities/Post"
import LikeEntity        from "@entities/Like"
import { AppDataSource } from "@config/data-source.config"
import { PaginateMeta }  from "@api/types/index.types"


export default class UserService {
    private userRepository = AppDataSource.getRepository( User )

    public async getSearchUsers( req: Request ){
        const page  = Number( req.query.page ) || 1
        const limit = Number( req.query.posts_per_page ) || 6

        try {
            const [users, count] = await this.userRepository
                .createQueryBuilder( 'user' )
                .where( 'user.id != :id', { id: req.user.id } )
                .leftJoinAndSelect( 'user.profile', 'profile' )
                .orderBy( 'user.createdAt', 'DESC' )
                .skip( limit * ( page - 1 ) )
                .take( limit )
                .getManyAndCount()

            return { users, meta: paginateMeta( count, page, limit ) }
        } catch ( err ) {
            throw new Error( "posts couldn't be fetched" )
        }
    }

    public async getOneUser( req: Request ){
        const { username } = req.params

        if( ! username ) throw new Error( "Username is missing" )

        try {
            return await this.userRepository
                .createQueryBuilder( 'user' )
                .leftJoinAndSelect( 'user.profile', 'profile' )
                .loadRelationCountAndMap( 'user.followingCount', 'user.following' )
                .loadRelationCountAndMap( 'user.followerCount', 'user.followers' )
                .where( 'user.username = :username', { username } )
                .getOne()
        } catch ( err ) {
            throw new Error( "User couldn't be fetched" )
        }
    }

    public async getUserMany( req: Request ): Promise<{ users: User[], meta: PaginateMeta }>{
        const page  = Number( req.query.page ) || 1
        const limit = Number( req.query.limit ) || 6
        const skip  = limit * ( page - 1 )

        const [users, count] = await this.userRepository
            .createQueryBuilder( 'user' )
            .leftJoinAndSelect( 'user.profile', 'profile' )
            .where( 'user.id != :userId', { userId: req.user?.id || 0 } )
            .orderBy( 'user.createdAt', 'DESC' )
            .skip( skip )
            .take( limit )
            .getManyAndCount()

        return { users, meta: paginateMeta( count, page, limit ) }
    }

    public async getManyPosts( req: Request ){
        const userId = req.params.userId
        const page   = Number( req.query.page ) || 1
        const limit  = Number( req.query.limit ) || 6
        const skip   = limit * ( page - 1 )

        if( ! userId ) throw new Error( "User id is missing" )

        try {
            const [posts, count] = await AppDataSource.getRepository( Post )
                .createQueryBuilder( 'post' )
                .where( 'post.userId = :userId', { userId } )
                .leftJoinAndSelect( 'post.user', 'user' )
                .loadRelationCountAndMap( 'post.commentCount', 'post.comments' )
                .leftJoinAndSelect( 'post.likes', 'like' )
                .loadRelationCountAndMap( 'post.likeCount', 'post.likes' )
                .orderBy( 'post.createdAt', 'DESC' )
                .skip( skip )
                .take( limit )
                .getManyAndCount()

            //check and set current user like
            if( req.isAuthenticated ){
                for ( let post of posts ) {
                    const like              = await LikeEntity.findOneBy( { userId: req.user.id, postId: post.id } )
                    post.hasCurrentUserLike = like ? true : false
                }
            }

            return { posts, meta: paginateMeta( count, page, limit ) }
        } catch ( err ) {
            console.log( err )
            throw new Error( "posts could not be fetched" )
        }
    }

    public async getFollowers( req: Request ){
        const userId = req.params.userId
        const page   = Number( req.query.page ) || 1
        const limit  = Number( req.query.limit ) || 10
        const skip   = limit * ( page - 1 )

        const [follows, count] = await AppDataSource.getRepository( Follow )
            .createQueryBuilder( 'follow' )
            .leftJoinAndSelect( 'follow.follower', 'follower' )
            .leftJoinAndSelect( 'follower.profile', 'profile' )
            .where( 'follow.sourceUserId = :sourceUserId', { sourceUserId: userId } )
            .take( limit )
            .skip( skip )
            .getManyAndCount()

        const followers = <User[]>[]
        for ( let follow of follows ) {
            followers.push( follow.follower )
        }

        return { followers, meta: paginateMeta( count, page, limit ) }
    }


    public async getFollowing( req: Request ){
        const userId = req.params.userId
        const page   = Number( req.query.page ) || 1
        const limit  = Number( req.query.limit ) || 10
        const skip   = limit * ( page - 1 )

        const [follows, count] = await AppDataSource.getRepository( Follow )
            .createQueryBuilder( 'follow' )
            .leftJoinAndSelect( 'follow.following', 'following' )
            .leftJoinAndSelect( 'following.profile', 'profile' )
            .where( 'follow.targetUserId = :targetUserId', { targetUserId: userId } )
            .take( limit )
            .skip( skip )
            .getManyAndCount()

        const following = <User[]>[]
        for ( let follow of follows ) {
            following.push( follow.following )
        }

        return { following, meta: paginateMeta( count, page, limit ) }
    }

    public async follow( req: Request ){
        const targetUserId = Number( req.params.targetUserId )

        if( ! targetUserId ) throw new Error( 'Target user id is missing' )

        const following = Follow.create( { sourceUserId: req.user.id, targetUserId } )

        try {
            return await following.save()
        } catch ( e ) {
            throw new Error( 'Could not be following' )
        }
    }

    public async unfollow( req: Request ){
        const targetUserId = Number( req.params.targetUserId )

        if( ! targetUserId ) throw new Error( 'Target user id is missing' )

        try {
            return await Follow.delete( { sourceUserId: req.user.id, targetUserId } )
        } catch ( e ) {
            throw new Error( 'Could not be unfollowing' )
        }
    }

}