import { Router } from "express"

import { ensureAuth }   from "@middleware/auth"
import FollowController from "@controllers/follow.controller"
import FollowService    from "@services/follow.service"

const router           = Router()
const followController = new FollowController( new FollowService() )

/**
 * @desc Add following
 * @route POST follows/following/:userId
 * @access Private
 */
router.post( '/following/:username', ensureAuth, followController.addFollowing )

/**
 * @desc Add following
 * @route DELETE follows/following/:userId
 * @access Private
 */
router.delete( '/following/:username', ensureAuth, followController.removeFollowing )

export default router