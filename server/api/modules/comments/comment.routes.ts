import { Router } from "express"

import { ensureAuth }    from "@middleware/auth.middleware"
import CommentController from "@modules/comments/comment.controller"
import CommentService    from "./comment.service"

const router            = Router()
const commentController = new CommentController( new CommentService() )

/**
 * @desc get comments
 * @route GET /posts/:postId/comments
 * @access Private
 */
router.get( '/:postId/comments/', ensureAuth, commentController.getMany )

/**
 * @desc create comment
 * @route POST /posts/:postId/comments
 * @access Private
 */
router.post( '/:postId/comments/', ensureAuth, commentController.create )


/**
 * @desc save comment like
 * @route POST /posts/:postId/comments/:commentId/like
 * @access Private
 */
router.post( '/:postId/comments/:commentId/like', ensureAuth, commentController.like )

/**
 * @desc comment unlike
 * @route POST /posts/:postId/comments/:commentId/unlike
 * @access Private
 */
router.post( '/:postId/comments/:commentId/unlike', ensureAuth, commentController.unlike )

export default router