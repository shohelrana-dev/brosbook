import { Router }    from "express"
import authRoutes    from "@modules/auth/auth.routes"
import accountRoutes from "@modules/account/account.routes"
import postRoutes    from "@modules/posts/post.routes"
import commentRoutes from "@modules/comments/comment.routes"
import userRoutes    from "@modules/users/user.routes"
import conversationRoutes    from "@modules/conversations/conversation.routes"

const router = Router()

//base routes
router.use( '/api/v1/auth', authRoutes )
router.use( '/api/v1/account', accountRoutes )
router.use( '/api/v1/users', userRoutes )
router.use( '/api/v1/posts', [postRoutes, commentRoutes] )
router.use( '/api/v1/conversations', conversationRoutes )

export default router