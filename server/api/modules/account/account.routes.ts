import { Router } from "express"
import authMiddleware from "@middleware/auth.middleware"
import AccountController from "@modules/account/account.controller"
import AccountService from "./account.service"

const accountController = new AccountController(new AccountService())

const router = Router()

/**
 * @desc Update user account profile
 * @route PUT /api/v1/account/profile
 * @access Private
 */
router.put('/profile', authMiddleware, accountController.updateProfile)

/**
 * @desc change account password
 * @route PUT /api/v1/account/password
 * @access Private
 */
router.put('/password', authMiddleware, accountController.changePassword)

export default router