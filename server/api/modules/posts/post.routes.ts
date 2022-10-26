import { Router } from "express"

import authMiddleware from "@middleware/auth.middleware"
import PostController from "@modules/posts/post.controller"
import PostService    from "./post.service"

const router         = Router()
const postController = new PostController( new PostService() )

/**
 * @desc get all posts
 * @route GET posts
 * @access Public
 * */
router.get( '/', postController.getManyPost )

/**
 * @desc create post
 * @route POST posts
 * @access Private
 * */

router.post( '/', authMiddleware, postController.createPost )

/**
 * @desc get feed posts
 * @route GET posts
 * @access Private
 * */
router.get( '/feed', authMiddleware, postController.getFeedPosts )

/**
 * @desc  save post like
 * @route POST posts/:postId/like
 * @access Private
 * */
router.post( '/:postId/like', authMiddleware, postController.like )

/**
 * @desc  remove post like
 * @route DELETE posts/:postId/unlike
 * @access Private
 * */
router.post( '/:postId/unlike', authMiddleware, postController.unlike )

export default router