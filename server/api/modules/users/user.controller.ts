import {NextFunction, Request, Response} from "express"
import UserService from "./user.service"
import {UploadedFile} from "express-fileupload"

export default class UserController {
    constructor(private readonly usersService: UserService) {
    }

    public getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.usersService.getCurrentUser(req.auth)

            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    public getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.usersService.getUserByUsername(req.params.username, req.auth)

            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    public getSearchUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {users, meta} = await this.usersService.getSearchUsers(req.query, req.auth)

            res.json({items: users, ...meta})
        } catch (err) {
            next(err)
        }
    }

    public getSuggestedUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {users, meta} = await this.usersService.getSuggestedUsers(req.query, req.auth)

            res.json({items: users, ...meta})
        } catch (err) {
            next(err)
        }
    }

    public getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId as string
        const page = Number(req.query.page)
        const limit = Number(req.query.limit)

        try {
            const {posts, meta} = await this.usersService.getUserPosts({userId, page, limit}, req.auth)

            res.json({items: posts, ...meta})
        } catch (err) {
            next(err)
        }
    }


    public getFollowedUsers = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId as string
        const page = Number(req.query.page)
        const limit = Number(req.query.limit)

        try {
            const {followedUsers, meta} = await this.usersService.getFollowedUsers({userId, page, limit}, req.auth)

            res.json({items: followedUsers, ...meta})
        } catch (err) {
            next(err)
        }
    }

    public getFollowers = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId as string
        const page = Number(req.query.page)
        const limit = Number(req.query.limit)

        try {
            const {followers, meta} = await this.usersService.getFollowers({userId, page, limit}, req.auth)

            res.json({items: followers, ...meta})
        } catch (err) {
            next(err)
        }
    }

    public changeAvatar = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.usersService.changeAvatar(req.files?.avatar as UploadedFile, req.auth)

            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    public changeCoverPhoto = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.usersService.changeCoverPhoto(req.files?.coverPhoto as UploadedFile, req.auth)

            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    public follow = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const followedUser = await this.usersService.follow(req.params.userId, req.auth)

            res.json(followedUser)
        } catch (err) {
            next(err)
        }
    }

    public unfollow = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const unfollowedUser = await this.usersService.unfollow(req.params.userId, req.auth)

            res.json(unfollowedUser)
        } catch (err) {
            next(err)
        }
    }

}