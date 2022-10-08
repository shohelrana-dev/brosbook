import { Router } from "express"
import authRoutes from "@modules/auth/auth.routes"
import chatRoutes from "@modules/chat/chat.routes"
import accountRoutes from "@modules/account/account.routes"
import postsRoutes    from "@modules/posts/post.routes"
import commentsRoutes from "@modules/comments/comment.routes"
import usersRoutes    from "@modules/users/user.routes"

const router = Router()

//base routes
router.use( '/api/v1/auth', authRoutes )
router.use( '/api/v1/account', accountRoutes )
router.use( '/api/v1/users', usersRoutes )
router.use( '/api/v1/posts', [postsRoutes, commentsRoutes] )
router.use( '/api/v1/chat', chatRoutes )

export default router