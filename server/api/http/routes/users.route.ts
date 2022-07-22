import { Router } from "express"

import { ensureAuth }  from "@middleware/auth"
import UsersController from "@controllers/users.controller"
import UsersService    from "@services/users.service"

const router          = Router()
const usersController = new UsersController( new UsersService() )

/**
 * @desc follow
 * @route POST users/follow
 * @access Private
 */
router.post( '/follow', ensureAuth, usersController.follow )

/**
 * @desc Add following
 * @route POST users/unfollow
 * @access Private
 */
router.post( '/unfollow', ensureAuth, usersController.unfollow )

export default router