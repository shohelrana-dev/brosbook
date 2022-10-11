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
 * @desc get suggested users
 * @route GET /api/v1/users/suggest
 * @access Private
 */
router.get( '/suggest', ensureAuth, usersController.getSuggestedUsers )

/**
 * @desc get user
 * @route GET /api/v1/users/:username
 * @access Public
 */
router.get( '/:username', usersController.getUser )

/**
 * @desc get user
 * @route GET /api/v1/users/:userId/posts
 * @access Public
 */
router.get( '/:userId/posts', usersController.getUserPosts )

/**
 * @desc get followers
 * @route GET /api/v1users/:userId/followers
 * @access Public
 */
router.get( '/:userId/followers', usersController.getFollowers )


/**
 * @desc get following
 * @route GET /api/v1/users/:userId/following
 * @access Public
 */
router.get( '/:userId/following', usersController.getFollowing )

/**
 * @desc follow
 * @route POST /api/v1/users/follow/:targetUserId
 * @access Private
 */
router.post( '/follow/:targetUserId', ensureAuth, usersController.follow )

/**
 * @desc Add following
 * @route POST /api/v1/users/unfollow/:targetUserId
 * @access Private
 */
router.post( '/unfollow/:targetUserId', ensureAuth, usersController.unfollow )

export default router