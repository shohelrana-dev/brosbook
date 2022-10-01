import { Router } from "express"

import { ensureAuth }  from "@middleware/auth.middleware"
import UsersController from "@modules/users/users.controller"
import UsersService    from "./users.service"

const router          = Router()
const usersController = new UsersController( new UsersService() )

/**
 * @desc get users
 * @route GET /users/search
 * @access Private
 */
router.get( '/search', usersController.getSuggestedUsers )

/**
 * @desc get user
 * @route GET /users/:username
 * @access Public
 */
router.get( '/:username', usersController.getUser )

/**
 * @desc get user
 * @route GET /users/:userId/posts
 * @access Public
 */
router.get( '/:userId/posts', usersController.getPosts )


/**
 * @desc get following
 * @route GET /users/:userId/following
 * @access Public
 */
router.get( '/:userId/following', usersController.getFollowing )

/**
 * @desc get followers
 * @route GET users/:userId/followers
 * @access Public
 */
router.get( '/:userId/followers', usersController.getFollowers )

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