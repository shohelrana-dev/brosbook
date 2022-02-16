import { getRepository } from "typeorm"

import User              from "@entities/User"
import HttpException     from "@exceptions/http.exception"
import { HTTP_CONFLICT } from "@utils/httpStatusCodes"
import { Request }       from "express"
import Post              from "@entities/Post"
import LikeEntity        from "@entities/Like"
import { paginateMeta }  from "@api/utils"
import Follow            from "@entities/Follow"


export default class ProfileService {

    public async getSuggestedUsers( req: Request ) {
        const page  = Number( req.query.page ) || 1
        const limit = Number( req.query.posts_per_page ) || 6

        try {
            const [ users, count ] = await getRepository( User )
                .createQueryBuilder( 'user' )
                .where( 'user.id != :id', { id: req.user.id } )
                .leftJoinAndSelect( 'user.profile', 'profile' )
                .orderBy( 'user.createdAt', 'DESC' )
                .skip( limit * ( page - 1 ) )
                .take( limit )
                .getManyAndCount()

            return { users, meta: paginateMeta( count, page, limit ) }
        } catch ( e ) {
            throw new HttpException( "posts couldn't be fetched", HTTP_CONFLICT )
        }
    }

    public async getUser( req: Request ) {
        const { username } = req.params

        if ( !username ) throw new HttpException( "Username is missing", HTTP_CONFLICT )

        try {
            return await getRepository( User )
                .createQueryBuilder( 'user' )
                .leftJoinAndSelect( 'user.profile', 'profile' )
                .loadRelationCountAndMap( 'user.followingCount', 'user.following' )
                .loadRelationCountAndMap( 'user.followerCount', 'user.followers' )
                .where( 'user.username = :username', { username } )
                .getOne()
        } catch ( e ) {
            console.log( e )
            throw new HttpException( "posts couldn't be fetched", HTTP_CONFLICT )
        }
    }

    public async getPosts( req: Request ) {
        const username = req.params.username
        const page     = Number( req.query.page ) || 1
        const limit    = Number( req.query.limit ) || 6
        const skip     = limit * ( page - 1 )

        if ( !username ) throw new HttpException( "Username is missing", HTTP_CONFLICT )

        try {
            const [ posts, count ] = await getRepository( Post )
                .createQueryBuilder( 'post' )
                .where( 'post.username = :username', { username } )
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
                const like              = await LikeEntity.findOne( { username: req.user.username, postId: post.id } )
                post.hasCurrentUserLike = like ? true : false
            }

            return { posts, meta: paginateMeta( count, page, limit ) }
        } catch ( e ) {
            throw new HttpException( "posts could not be fetched", HTTP_CONFLICT )
        }
    }


    public async getFollowing( req: Request ) {
        const username = req.params.username
        const page     = Number( req.query.page ) || 1
        const limit    = Number( req.query.limit ) || 10
        const skip     = limit * ( page - 1 )

        try {
            const [ follows, count ] = await getRepository( Follow )
                .createQueryBuilder( 'follow' )
                .leftJoinAndSelect( 'follow.following', 'following' )
                .leftJoinAndSelect( 'following.profile', 'profile' )
                .where( 'follow.followingUsername = :username', { username } )
                .take( limit )
                .skip( skip )
                .getManyAndCount()

            //console.log(follows)

            const following = <User[]>[]
            for ( let follow of follows ) {
                following.push( follow.following )
            }

            return { following, meta: paginateMeta( count, page, limit ) }
        } catch ( e ) {
            console.log( e )
            throw new HttpException( 'Following could not be fetched', HTTP_CONFLICT )
        }
    }

    public async getFollowers( req: Request ) {
        const username = req.params.username
        const page     = Number( req.query.page ) || 1
        const limit    = Number( req.query.limit ) || 10
        const skip     = limit * ( page - 1 )

        try {
            const [ follows, count ] = await getRepository( Follow )
                .createQueryBuilder( 'follow' )
                .leftJoinAndSelect( 'follow.follower', 'follower' )
                .leftJoinAndSelect( 'follower.profile', 'profile' )
                .where( 'follow.username = :username', { username } )
                .take( limit )
                .skip( skip )
                .getManyAndCount()

            console.log( follows )

            const followers = <User[]>[]
            for ( let follow of follows ) {
                followers.push( follow.follower )
            }
            return { followers, meta: paginateMeta( count, page, limit ) }
        } catch ( e ) {
            console.log( e )
            throw new HttpException( 'Following could not be fetched', HTTP_CONFLICT )
        }
    }

}