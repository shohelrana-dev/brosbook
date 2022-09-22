import { Router } from "express"
import authRoute     from "@api/modules/auth/auth.route"
import chatRoute     from "@api/modules/chat/chat.route"
import settingsRoute from "@api/modules/settings/settings.route"
import postsRoute    from "@api/modules/posts/posts.route"
import commentsRoute from "@api/modules/comments/comments.route"
import usersRoute    from "@api/modules/users/users.route"

const router = Router()

//base routes
router.use( '/api/v1/auth', authRoute )
router.use( '/api/v1/chat', chatRoute )
router.use( '/api/v1/settings', settingsRoute )
router.use( '/api/v1/posts', postsRoute )
router.use( '/api/v1/comments', commentsRoute )
router.use( '/api/v1/users', usersRoute )

export default router