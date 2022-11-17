import {Request} from "express"
import Relationship from "@entities/Relationship"
import User from "@entities/User"
import {paginateMeta} from "@utils/paginateMeta"
import Post from "@entities/Post"
import LikeEntity from "@entities/Like"
import {appDataSource} from "@config/data-source.config"
import {PaginateMeta} from "@api/types/index.types"
import InternalServerException from "@exceptions/InternalServerException"
import BadRequestException from "@exceptions/BadRequestException"
import savePhoto from "@utils/savePhoto";
import {PhotoSource} from "@api/enums";
import {UploadedFile} from "express-fileupload"
import Profile from "@entities/Profile"


export default class UserService {
    private userRepository = appDataSource.getRepository(User)

    public async getCurrentUser(req: Request) {
        try {
            const user = await this.userRepository.findOneOrFail({
                where: {username: req.user.username},
                relations: {profile: true}
            })
            delete user.password

            return user
        }catch (err) {
            throw new InternalServerException('User was not found.')
        }
    }

    public async getUserByUsername(req: Request) {
        const {username} = req.params
        if (!username) throw new BadRequestException("Username is missing")

        try {
            const user = await this.userRepository.findOneOrFail({
                where: {username},
                relations: {profile: true}
            })

            //set isCurrentUserFollow
            if (req.isAuthenticated && req.user.id !== user.id) {
                const follow = await Relationship.findOneBy({
                    followerId: req.user.id,
                    followedId: user.id
                })
                user.isCurrentUserFollow = follow ? true : false
            }

            //followers count
            //@ts-ignore
            user.followerCount = await Relationship.countBy({followedId: user.id})

            //followings count
            //@ts-ignore
            user.followingCount = await Relationship.countBy({followerId: user.id})

            delete user.password

            return user
        }catch (err) {
            throw new InternalServerException('User was not found.')
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

            users.map(user => {
                delete user.password
            })

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

        users.map(user => {
            delete user.password
        })

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

        followers.map(user => {
            delete user.password
        })

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

        following.map(user => {
            delete user.password
        })


        return { following, meta: paginateMeta(count, page, limit) }
    }

    public async changeProfilePhoto(req: Request) {
        try {
            const photo = req.files.photo as UploadedFile

            const url = await savePhoto({file: photo, userId: req.user.id, source: PhotoSource.PROFILE, sourceId: req.user.id})

            let user = await this.userRepository.findOneByOrFail({id: req.user.id})
            user.photo = url
            user = await user.save()

            delete user.password

            return user
        }catch (e) {
            console.log(e)
            throw new InternalServerException('Profile photo could not be uploaded.')
        }
    }

    public async changeCoverPhoto(req: Request): Promise<User> {
        try {
            const photo = req.files.photo as UploadedFile

            const url = await savePhoto({file: photo, userId: req.user.id, source: PhotoSource.PROFILE, sourceId: req.user.id})
            console.log('photo url', url)
            const profile = await Profile.findOneByOrFail({userId: req.user.id})
            profile.coverPhoto = url
            await profile.save()

            const user = await this.userRepository.findOne({where: {id: req.user.id}, relations: {profile: true}})
            delete user.password

            return user
        }catch (e) {
            console.log(e)
            throw new InternalServerException('Cover photo could not be uploaded.')
        }
    }

    public async follow(req: Request) {
        const {userId} = req.params

        if (!userId) throw new BadRequestException('Target user id is missing')

        const following = Relationship.create({ followerId: req.user.id, followedId: userId })

        return await following.save()
    }

    public async unfollow(req: Request) {
        const {userId} = req.params

        if (!userId) throw new BadRequestException('Target user id is missing')

        return await Relationship.delete({ followerId: req.user.id, followedId: userId })
    }

}