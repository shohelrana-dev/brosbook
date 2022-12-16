import { Router }     from "express"
import authMiddleware from "@middleware/auth.middleware"
import PostController from "@modules/posts/post.controller"
import PostService    from "./post.service"

const router         = Router()
const postService    = new PostService()
const postController = new PostController( postService )

/**
 * @desc get all posts
 * @route GET posts
 * @access Public
 * */
router.get( '/', postController.getMany )

/**
 * @desc create post
 * @route POST posts
 * @access Private
 * */

router.post( '/', authMiddleware, postController.create )

/**
 * @desc get feed posts
 * @route GET posts
 * @access Private
 * */
router.get( '/feed', authMiddleware, postController.getFeedPosts )

/**
 * @desc get post by id
 * @route GET posts/:id
 * @access Public
 * */
router.get( '/:id', postController.getPostById )

/**
 * @desc delete post
 * @route DELETE posts/:id
 * @access Private
 * */

router.delete( '/:id', authMiddleware, postController.delete )

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