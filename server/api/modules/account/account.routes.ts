import { Router }         from "express"
import { ensureAuth }    from "@middleware/auth.middleware"
import AccountValidation from "@modules/account/account.validation"
import AccountController from "@modules/account/account.controller"
import AccountService    from "./account.service"

const validation         = new AccountValidation()
const accountController = new AccountController( new AccountService() )

const router = Router()

/**
 * @desc Update user profile
 * @route PUT account/profile
 * @access Private
 */
router.put( '/profile', ensureAuth, validation.updateProfile(), accountController.updateProfile )

/**
 * @desc change account password
 * @route PUT account/password
 * @access Private
 */
router.put( '/password', ensureAuth, validation.changePassword(), accountController.changePassword )

export default router