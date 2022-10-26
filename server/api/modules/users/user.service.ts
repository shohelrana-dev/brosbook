import { Request } from "express"
import Relationship from "@entities/Relationship"
import User from "@entities/User"
import { paginateMeta } from "@utils/paginateMeta"
import Post from "@entities/Post"
import LikeEntity from "@entities/Like"
import { appDataSource } from "@config/data-source.config"
import { PaginateMeta } from "@api/types/index.types"
import { SignupUserDTO } from "@api/modules/users/user.dto"
import { v4 as uuid } from "uuid"
import { PhotoSource } from "@api/enums"
import Media from "@api/entities/Media"
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library"
import HttpException from "@api/utils/HttpException"
import httpStatus from "http-status"
import InternalServerException from "@exceptions/InternalServerException";
import BadRequestException from "@exceptions/BadRequestException";


export default class UserService {
    private userRepository = appDataSource.getRepository(User)

    public async getUserByUsername(username: string) {
        if (!username) throw new BadRequestException("Username is missing")

        try {
            return await this.userRepository.findOneOrFail({
                where: {username},
                relations: {profile: true}
            })
        }catch (err) {
            throw new InternalServerException('User couldn\'t be found.')
        }
    }

    public async getSearchUsers(req: Request) {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.posts_per_page) || 6

        try {
            const [users, count] = await this.userRepository
                .createQueryBuilder('user')
                .where('user.id != :id', { id: req.user.id })
                .leftJoinAndSelect('user.profile', 'profile')
                .orderBy('user.createdAt', 'DESC')
                .skip(limit * (page - 1))
                .take(limit)
                .getManyAndCount()

            return { users, meta: paginateMeta(count, page, limit) }
        } catch (err) {
            throw new Error("posts couldn't be fetched")
        }
    }

    public async getSuggestedUsers(req: Request): Promise<{ users: User[], meta: PaginateMeta }> {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 6
        const skip = limit * (page - 1)

        const [users, count] = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('user.id != :userId', { userId: req.user?.id || 0 })
            .orderBy('user.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        if (req.isAuthenticated) {
            for (let user of users) {
                const follow = await Relationship.findOneBy({
                    followerId: req.user.id,
                    followedId: user.id
                })

                user.isCurrentUserFollow = follow ? true : false
            }
        }

        return { users, meta: paginateMeta(count, page, limit) }
    }

    public async getUserPosts(req: Request) {
        const userId = req.params.userId
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 6
        const skip = limit * (page - 1)

        if (!userId) throw new Error("User id is missing")

        const [posts, count] = await appDataSource.getRepository(Post)
            .createQueryBuilder('post')
            .where('post.userId = :userId', { userId })
            .leftJoinAndSelect('post.user', 'user')
            .loadRelationCountAndMap('post.commentCount', 'post.comments')
            .leftJoinAndSelect('post.likes', 'like')
            .loadRelationCountAndMap('post.likeCount', 'post.likes')
            .orderBy('post.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        //check and set current user like
        if (req.isAuthenticated) {
            for (let post of posts) {
                const like = await LikeEntity.findOneBy({ userId: req.user.id, postId: post.id })
                post.hasCurrentUserLike = like ? true : false
            }
        }
        console.log('req.isAuthenticated')
        console.log(req.user)
        console.log(req.isAuthenticated)
        console.log('req.isAuthenticated')
        return { posts, meta: paginateMeta(count, page, limit) }
    }

    public async getFollowers(req: Request) {
        const userId = req.params.userId
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = limit * (page - 1)

        const [follows, count] = await appDataSource.getRepository(Relationship)
            .createQueryBuilder('follow')
            .leftJoinAndSelect('follow.follower', 'follower')
            .leftJoinAndSelect('follower.profile', 'profile')
            .where('follow.followedId = :followedId', { followedId: userId })
            .take(limit)
            .skip(skip)
            .getManyAndCount()

        const followers = <User[]>[]
        for (let follow of follows) {
            followers.push(follow.follower)
        }

        return { followers, meta: paginateMeta(count, page, limit) }
    }


    public async getFollowing(req: Request) {
        const userId = req.params.userId
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = limit * (page - 1)

        const [follows, count] = await appDataSource.getRepository(Relationship)
            .createQueryBuilder('follow')
            .leftJoinAndSelect('follow.following', 'following')
            .leftJoinAndSelect('following.profile', 'profile')
            .where('follow.followerId = :followerId', { followerId: userId })
            .take(limit)
            .skip(skip)
            .getManyAndCount()

        const following = <User[]>[]
        for (let follow of follows) {
            following.push(follow.following)
        }

        return { following, meta: paginateMeta(count, page, limit) }
    }

    public async follow(req: Request) {
        const targetUserId = Number(req.params.targetUserId)

        if (!targetUserId) throw new Error('Target user id is missing')

        const following = Relationship.create({ followerId: req.user.id, followedId: targetUserId })

        return await following.save()
    }

    public async unfollow(req: Request) {
        const targetUserId = Number(req.params.targetUserId)

        if (!targetUserId) throw new Error('Target user id is missing')

        return await Relationship.delete({ followerId: req.user.id, followedId: targetUserId })
    }

}