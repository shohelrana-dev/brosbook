import { Router } from "express"

import authMiddleware from "@middleware/auth.middleware"
import UserController from "@modules/users/user.controller"
import UserService    from "./user.service"

const router          = Router()
const usersController = new UserController( new UserService() )

/**
 * @desc get current user
 * @route GET /api/v1/users/me
 * @access Private
 */
router.get( '/me', authMiddleware, usersController.getCurrentUser )

/**
 * @desc change profile photo
 * @route POST /api/v1/users/me/avatar
 * @access Private
 */
router.post( '/me/avatar', authMiddleware, usersController.changeAvatar )

/**
 * @desc change cover photo
 * @route POST /api/v1/users/me/cover_photo
 * @access Private
 */
router.post( '/me/cover_photo', authMiddleware, usersController.changeCoverPhoto )

/**
 * @desc get users
 * @route GET /api/v1/users/search
 * @access Private
 */
router.get( '/search', usersController.getSearchUsers )

/**
 * @desc get suggested users
 * @route GET /api/v1/users/suggest
 * @access Private
 */
router.get( '/suggest', authMiddleware, usersController.getSuggestedUsers )

/**
 * @desc get user
 * @route GET /api/v1/users/:username
 * @access Public
 */
router.get( '/:username', usersController.getUserByUsername )

/**
 * @desc get user
 * @route GET /api/v1/users/:userId/posts
 * @access Public
 */
router.get( '/:userId/posts', usersController.getUserPosts )

/**
 * @desc get followers
 * @route GET /api/v1/users/:userId/followers
 * @access Public
 */
router.get( '/:userId/followers', usersController.getFollowers )


/**
 * @desc get following
 * @route GET /api/v1/users/:userId/following
 * @access Public
 */
router.get( '/:userId/following', usersController.getFollowedUsers )

/**
 * @desc follow
 * @route POST /api/v1/users/follow/:userId
 * @access Private
 */
router.post( '/follow/:userId', authMiddleware, usersController.follow )

/**
 * @desc Add following
 * @route POST /api/v1/users/unfollow/:userId
 * @access Private
 */
router.post( '/unfollow/:userId', authMiddleware, usersController.unfollow )

export default router