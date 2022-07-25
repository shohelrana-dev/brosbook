import { Router }    from "express"
import authRoute     from "@routes/auth.route"
import chatRoute     from "@routes/chat.route"
import settingsRoute from "@routes/settings.route"
import postsRoute    from "@routes/posts.route"
import commentsRoute from "@routes/comments.route"
import usersRoute    from "@routes/users.route"

const router = Router()

//base routes
router.use( '/api/v1/auth', authRoute )
router.use( '/api/v1/chat', chatRoute )
router.use( '/api/v1/settings', settingsRoute )
router.use( '/api/v1/posts', postsRoute )
router.use( '/api/v1/comments', commentsRoute )
router.use( '/api/v1/users', usersRoute )

export default router