import { Router } from "express"

import { ensureAuth } from "@api/middleware/auth"
import PostController from "@api/modules/posts/post.controller"
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
 * @route POST posts/:postId/like
 * @access Private
 * */
router.post( '/:postId/like', ensureAuth, postController.like )

/**
 * @desc  remove post like
 * @route DELETE posts/:postId/unlike
 * @access Private
 * */
router.post( '/:postId/unlike', ensureAuth, postController.unlike )

export default router