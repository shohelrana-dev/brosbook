import { Router } from "express"
import authMiddleware from "@middleware/auth.middleware"
import UserController from "@modules/users/user.controller"
import UserService from "./user.service"

const router          = Router()
const userService     = new UserService()
const usersController = new UserController( userService )

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
router.get( '/search', usersController.searchUsers )

/**
 * @desc get suggested users
 * @route GET /api/v1/users/suggestions
 * @access Private
 */
router.get( '/suggestions', authMiddleware, usersController.getSuggestions )

/**
 * @desc get user by user id
 * @route GET /api/v1/users/:userId
 * @access Public
 */
router.get( '/:userId', usersController.getUserById )

/**
 * @desc get user by username =
 * @route GET /api/v1/users/by/username/:username
 * @access Public
 */
router.get( '/by/username/:username', usersController.getUserByUsername )

/**
 * @desc get followers
 * @route GET /api/v1/users/:userId/followers
 * @access Public
 */
router.get( '/:userId/followers', usersController.getFollowers )

/**
 * @desc get followers count
 * @route GET /api/v1/users/:userId/followers/count
 * @access Public
 */
router.get( '/:userId/followers/count', usersController.getFollowersCount )


/**
 * @desc get followings
 * @route GET /api/v1/users/:userId/followings
 * @access Public
 */
router.get( '/:userId/followings', usersController.getFollowings )


/**
 * @desc get followings count
 * @route GET /api/v1/users/:userId/followings/count
 * @access Public
 */
router.get( '/:userId/followings/count', usersController.getFollowingsCount )

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