import { Router } from "express"

import { ensureAuth }  from "@api/middleware/auth"
import UsersController from "@api/modules/users/users.controller"
import UsersService    from "./users.service"

const router          = Router()
const usersController = new UsersController( new UsersService() )

/**
 * @desc get users
 * @route GET user/search
 * @access Private
 */
router.get( '/search', usersController.getSuggestedUsers )

/**
 * @desc get user
 * @route GET users/:username
 * @access Public
 */
router.get( '/:username', usersController.getUser )

/**
 * @desc get user
 * @route GET users/:username/posts
 * @access Public
 */
router.get( '/:username/posts', usersController.getPosts )


/**
 * @desc get following
 * @route GET users/:username/following
 * @access Public
 */
router.get( '/:username/following',  usersController.getFollowing )

/**
 * @desc get followers
 * @route GET users/:username/followers
 * @access Public
 */
router.get( '/:username/followers', usersController.getFollowers )

/**
 * @desc follow
 * @route POST users/follow
 * @access Private
 */
router.post( '/follow', ensureAuth, usersController.follow )

/**
 * @desc Add following
 * @route POST users/unfollow
 * @access Private
 */
router.post( '/unfollow', ensureAuth, usersController.unfollow )

export default router