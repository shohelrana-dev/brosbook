import { Router } from "express"
import { ensureAuth } from "@middleware/auth.middleware"
import AccountValidation from "@modules/account/account.validation"
import AccountController from "@modules/account/account.controller"
import AccountService from "./account.service"
import { validationMiddleware } from "@api/middleware/validation.middleware"

const validation = new AccountValidation()
const accountController = new AccountController(new AccountService())

const router = Router()

/**
 * @desc Update user account profile
 * @route PUT /api/v1/account/profile
 * @access Private
 */
router.put('/profile', ensureAuth, [...validation.updateProfile(), validationMiddleware], accountController.updateProfile)

/**
 * @desc change account password
 * @route PUT /api/v1/account/password
 * @access Private
 */
router.put('/password', ensureAuth, [...validation.changePassword(), validationMiddleware], accountController.changePassword)

export default router