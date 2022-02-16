import { Router } from "express"

import ProfileController from "@controllers/profile.controller"
import ProfileService    from "@services/profile.service"

const router         = Router()
const profileController = new ProfileController( new ProfileService() )

/**
 * @desc get users
 * @route GET user/search
 * @access Private
 */
router.get( '/', profileController.getSuggestedUsers )

/**
 * @desc get user
 * @route GET profile/:username
 * @access Public
 */
router.get( '/:username', profileController.getUser )

/**
 * @desc get user
 * @route GET profile/:username/posts
 * @access Public
 */
router.get( '/:username/posts', profileController.getPosts )


/**
 * @desc get following
 * @route GET profile/:username/following
 * @access Public
 */
router.get( '/:username/following',  profileController.getFollowing )

/**
 * @desc get followers
 * @route GET profile/:username/followers
 * @access Public
 */
router.get( '/:username/followers', profileController.getFollowers )

export default router