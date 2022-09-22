import { Router } from "express"

import { ensureAuth }    from "@api/middleware/auth"
import CommentController from "@api/modules/comments/comment.controller"
import CommentService    from "./comment.service"

const router            = Router()
const commentController = new CommentController( new CommentService() )

/**
 * @desc get comments
 * @route GET comments
 * @access Private
 */
router.get( '/', ensureAuth, commentController.getComments )

/**
 * @desc create comment
 * @route POST /comments
 * @access Private
 */
router.post( '/', ensureAuth, commentController.create )


/**
 * @desc save comment like
 * @route POST comments/:commentId/like
 * @access Private
 */
router.post( '/:commentId/like', ensureAuth, commentController.like )

/**
 * @desc comment unlike
 * @route POST comments/:commentId/unlike
 * @access Private
 */
router.post( '/:postId/comments/:commentId/unlike', ensureAuth, commentController.unlike )

export default router