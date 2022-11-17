import { Router } from "express"
import authMiddleware from "@middleware/auth.middleware"
import AccountController from "@modules/account/account.controller"
import AccountService from "./account.service"
import validationMiddleware from "@middleware/validation.middleware"
import {ChangePasswordDTO, ChangeUsernameDTO, UpdateProfileDTO} from "@modules/account/account.dto"

const accountController = new AccountController(new AccountService())

const router = Router()

/**
 * @desc Update user account profile
 * @route PUT /api/v1/account/profile
 * @access Private
 */
router.put('/profile', authMiddleware, validationMiddleware(UpdateProfileDTO), accountController.updateProfile)

/**
 * @desc change account username
 * @route PUT /api/v1/account/username
 * @access Private
 */
router.put('/username', authMiddleware, validationMiddleware(ChangeUsernameDTO), accountController.changeUsername)

/**
 * @desc change account password
 * @route PUT /api/v1/account/password
 * @access Private
 */
router.put('/password', authMiddleware, validationMiddleware(ChangePasswordDTO), accountController.changePassword)

export default router