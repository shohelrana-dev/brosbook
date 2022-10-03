import { Router } from "express"

import { ensureAuth } from "@middleware/auth.middleware"
import UserController from "@modules/users/user.controller"
import UserService    from "./user.service"

const router          = Router()
const usersController = new UserController( new UserService() )

/**
 * @desc get users
 * @route GET /users/search
 * @access Private
 */
router.get( '/search', usersController.getSearchUsers )

/**
 * @desc get user
 * @route GET /users/:username
 * @access Public
 */
router.get( '/:username', usersController.getOneUser )

/**
 * @desc get users
 * @route GET /users
 * @access Public
 */
router.get( '/', usersController.getManyUser )

/**
 * @desc get user
 * @route GET /users/:userId/posts
 * @access Public
 */
router.get( '/:userId/posts', usersController.getManyPosts )

/**
 * @desc get followers
 * @route GET users/:userId/followers
 * @access Public
 */
router.get( '/:userId/followers', usersController.getFollowers )


/**
 * @desc get following
 * @route GET /users/:userId/following
 * @access Public
 */
router.get( '/:userId/following', usersController.getFollowing )

/**
 * @desc follow
 * @route POST /users/follow/:targetUserId
 * @access Private
 */
router.post( '/follow/:targetUserId', ensureAuth, usersController.follow )

/**
 * @desc Add following
 * @route POST /users//unfollow/:targetUserId
 * @access Private
 */
router.post( '/unfollow/:targetUserId', ensureAuth, usersController.unfollow )

export default router