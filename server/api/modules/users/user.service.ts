import Relationship from "@entities/Relationship"
import User from "@entities/User"
import {paginateMeta} from "@utils/paginateMeta"
import Post from "@entities/Post"
import {appDataSource} from "@config/data-source.config"
import {Auth, PaginateMeta, PaginateQuery} from "@api/types/index.types"
import InternalServerException from "@exceptions/InternalServerException"
import BadRequestException from "@exceptions/BadRequestException"
import savePhoto from "@utils/savePhoto"
import {PhotoSource} from "@api/enums"
import {UploadedFile} from "express-fileupload"
import Profile from "@entities/Profile"
import formatPost from "@utils/formatPost"
import formatUser from "@utils/formatUser"


export default class UserService {
    private userRepository = appDataSource.getRepository(User)

    public async getCurrentUser(auth: Auth) {
        try {
            const user = await this.userRepository.findOneOrFail({
                where: {id: auth.user.id},
                relations: {profile: true}
            })
            delete user.password

            return user
        } catch (err) {
            throw new InternalServerException('User was not found.')
        }
    }

    public async getUserByUsername(username: string, auth: Auth): Promise<User> {
        if (!username) throw new BadRequestException("Username was not given.")

        try {
            const user = await this.userRepository.findOneOrFail({
                where: {username},
                relations: {profile: true}
            })

            //followers count
            user.followerCount = await Relationship.countBy({followedId: user.id})

            //followings count
            user.followingCount = await Relationship.countBy({followerId: user.id})

            return await formatUser(user, auth)
        } catch (err) {
            throw new InternalServerException('User was not found.')
        }
    }

    public async getSearchUsers(data: PaginateQuery, auth: Auth): Promise<{ users: User[], meta: PaginateMeta }> {
        const page = data.page || 1
        const limit = data.limit || 6
        const skip = limit * (page - 1)

        try {
            const [users, count] = await this.userRepository
                .createQueryBuilder('user')
                .where('user.id != :id', {id: auth.user.id})
                .leftJoinAndSelect('user.profile', 'profile')
                .orderBy('user.createdAt', 'DESC')
                .skip(skip)
                .take(limit)
                .getManyAndCount()

            const formattedUsers = await Promise.all(users.map(user => formatUser(user, auth)))

            return {users: formattedUsers, meta: paginateMeta(count, page, limit)}
        } catch (err) {
            throw new InternalServerException("Unknown error during database operation.")
        }
    }

    public async getSuggestedUsers(data: PaginateQuery, auth: Auth): Promise<{ users: User[], meta: PaginateMeta }> {
        const page = data.page || 1
        const limit = data.limit || 6
        const skip = limit * (page - 1)

        try {
            const [users, count] = await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.profile', 'profile')
                .where('user.id != :userId', {userId: auth.user?.id || 0})
                .orderBy('user.createdAt', 'DESC')
                .skip(skip)
                .take(limit)
                .getManyAndCount()

            const formattedUsers = await Promise.all(users.map(user => formatUser(user, auth)))

            return {users: formattedUsers, meta: paginateMeta(count, page, limit)}
        } catch (e) {
            throw new InternalServerException("Unknown error during database operation.")
        }
    }

    public async getUserPosts(data: PaginateQuery, auth: Auth): Promise<{ posts: Post[], meta: PaginateMeta }> {
        const userId = data.userId
        const page = data.page || 1
        const limit = data.limit || 6
        const skip = limit * (page - 1)

        if (!userId) throw new BadRequestException("User id was not given.")

        try {
            const [posts, count] = await appDataSource.getRepository(Post)
                .createQueryBuilder('post')
                .where('post.authorId = :userId', {userId})
                .leftJoinAndSelect('post.author', 'user')
                .loadRelationCountAndMap('post.commentCount', 'post.comments')
                .leftJoinAndSelect('post.likes', 'like')
                .loadRelationCountAndMap('post.likeCount', 'post.likes')
                .orderBy('post.createdAt', 'DESC')
                .skip(skip)
                .take(limit)
                .getManyAndCount()

            const formattedPosts = await Promise.all(posts.map((post => formatPost(post, auth))))

            return {posts: formattedPosts, meta: paginateMeta(count, page, limit)}
        } catch (e) {
            throw new InternalServerException('Unknown error during database operation.')
        }
    }

    public async getFollowers(data: PaginateQuery, auth: Auth): Promise<{ followers: User[], meta: PaginateMeta }> {
        const userId = data.userId
        const page = data.page || 1
        const limit = data.limit || 10
        const skip = limit * (page - 1)

        const [relationships, count] = await appDataSource.getRepository(Relationship)
            .createQueryBuilder('relationship')
            .leftJoinAndSelect('relationship.follower', 'follower')
            .leftJoinAndSelect('follower.profile', 'profile')
            .where('relationship.followedId = :followedId', {followedId: userId})
            .take(limit)
            .skip(skip)
            .getManyAndCount()

        const followers = <User[]>[]
        for (let relationship of relationships) {
            followers.push(relationship.follower)
        }

        const formattedFollowers = await Promise.all(followers.map(user => formatUser(user, auth)))

        return {followers: formattedFollowers, meta: paginateMeta(count, page, limit)}
    }


    public async getFollowedUsers(data: PaginateQuery, auth: Auth): Promise<{ followedUsers: User[], meta: PaginateMeta }> {
        const userId = data.userId
        const page = data.page || 1
        const limit = data.limit || 10
        const skip = limit * (page - 1)

        try {
            const [relationships, count] = await appDataSource.getRepository(Relationship)
                .createQueryBuilder('relationship')
                .leftJoinAndSelect('relationship.followedUser', 'followedUser')
                .leftJoinAndSelect('followedUser.profile', 'profile')
                .where('relationship.followerId = :followerId', {followerId: userId})
                .take(limit)
                .skip(skip)
                .getManyAndCount()

            const followedUsers = <User[]>[]
            for (let relationship of relationships) {
                followedUsers.push(relationship.followedUser)
            }

            const formattedFollowedUsers = await Promise.all(followedUsers.map(user => formatUser(user, auth)))

            return {followedUsers: formattedFollowedUsers, meta: paginateMeta(count, page, limit)}
        }catch (e){
            throw new InternalServerException('Unknown error during database operation.')
        }
    }

    public async changeAvatar(avatar: UploadedFile, auth: Auth) {
        try {
            const media = await savePhoto({
                file: avatar,
                userId: auth.user.id,
                source: PhotoSource.AVATAR,
                sourceId: auth.user.id
            })

            let user = await this.userRepository.findOneByOrFail({id: auth.user.id})
            user.avatar = media.url
            user = await user.save()

            delete user.password

            return user
        } catch (e) {
            throw new InternalServerException('Profile photo could not be uploaded.')
        }
    }

    public async changeCoverPhoto(coverPhoto: UploadedFile, auth: Auth): Promise<User> {
        try {
            const media = await savePhoto({
                file: coverPhoto,
                userId: auth.user.id,
                source: PhotoSource.COVER_PHOTO,
                sourceId: auth.user.id
            })
            const profile = await Profile.findOneByOrFail({userId: auth.user.id})
            profile.coverPhoto = media.url
            await profile.save()

            const user = await this.userRepository.findOne({
                where: {id: auth.user.id},
                relations: {profile: true}
            })
            delete user.password

            return user
        } catch (e) {
            throw new InternalServerException('Cover photo could not be uploaded.')
        }
    }

    public async follow(targetUserId: string, auth: Auth): Promise<User> {
        const user = await this.userRepository.findOneBy({id: targetUserId})

        if (!user) throw new BadRequestException('Target user does not exists.')

        try {
            await Relationship.create({followerId: auth.user.id, followedId: targetUserId}).save()

            user.isViewerFollow = true
            delete user.password

            return user
        }catch (e){
            console.log(e)
            throw new InternalServerException('Unknown error during database operation.')
        }
    }

    public async unfollow(targetUserId: string, auth: Auth): Promise<User> {
        const user = await this.userRepository.findOneBy({id: targetUserId})

        if (!user) throw new BadRequestException('Target user does not exists.')

        try {
            await Relationship.delete({followerId: auth.user.id, followedId: targetUserId})

            user.isViewerFollow = false
            delete user.password

            return user
        }catch (e){
            throw new InternalServerException('Unknown error during database operation.')
        }
    }

}