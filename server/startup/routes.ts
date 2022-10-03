import { Router }    from "express"
import authRoute     from "@modules/auth/auth.route"
import chatRoute     from "@modules/chat/chat.route"
import settingsRoute from "@modules/settings/setting.routes"
import postsRoute    from "@modules/posts/post.routes"
import commentsRoute from "@modules/comments/comments.route"
import usersRoute    from "@modules/users/user.routes"

const router = Router()

//base routes
router.use( '/api/v1/auth', authRoute )
router.use( '/api/v1/chat', chatRoute )
router.use( '/api/v1/settings', settingsRoute )
router.use( '/api/v1/posts', [postsRoute, commentsRoute] )
router.use( '/api/v1/users', usersRoute )

export default router