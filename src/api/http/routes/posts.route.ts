import { Router } from "express"

import { ensureAuth } from "@middleware/auth"
import PostController from "@controllers/post.controller"
import PostService    from "@services/post.service"

const router          = Router()
const postController = new PostController( new PostService() )

/**
 * @desc get posts
 * @route GET posts
 * @access Public
 * */
router.get( '/', postController.getPosts )

/**
 * @desc create post
 * @route POST posts
 * @access Private
 * */

router.post( '/', ensureAuth, postController.createPost )

/**
 * @desc  save post like
 * @route POST posts/:postId/likes
 * @access Private
 * */
router.post( '/:postId/likes', ensureAuth, postController.saveLike )

/**
 * @desc  remove post like
 * @route DELETE posts/:postId/likes
 * @access Private
 * */
router.delete( '/:postId/likes', ensureAuth, postController.deleteLike )

export default router