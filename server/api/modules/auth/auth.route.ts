import { Router } from "express"

import AuthController from "@api/modules/auth/auth.controller"
import AuthService    from "./auth.service"
import AuthValidation from "@api/modules/auth/auth.validation"
import { ensureAuth } from "@api/middleware/auth"

const router         = Router()
const authController = new AuthController( new AuthService() )
const validation     = new AuthValidation()
/**
 * @desc signup user
 * @route POST /auth/signup
 * @access Public
 */
router.post( '/signup', validation.signup(), authController.signup )

/**
 * @desc local login
 * @route POST /auth/login
 * @access Public
 */
router.post( '/login', validation.login(), authController.login )

/**
 * @desc google login
 * @route POST /auth/google
 * @access Public
 */
router.post( '/google', authController.google )

/**
 * @desc logout
 * @route GET /auth/logout
 * @access Public
 */
router.get( '/logout', authController.logout )

/**
 * @desc make log in user
 * @route GET /auth/me
 * @access Protected
 */
router.get( '/me', ensureAuth, authController.me )

/**
 * @desc forgot password
 * @route GET /auth/forgot-password
 * @access Public
 */
router.post( '/forgot-password', validation.forgotPassword(), authController.forgotPassword )

/**
 * @desc reset password token verify
 * @route GET /auth/reset-password/:token
 * @access Public
 */
router.get( '/reset-password/:token', authController.resetPassTokenVerify )

/**
 * @desc reset password
 * @route POST /auth/forgot-password/:token
 * @access Public
 */
router.post( '/reset-password/:token', validation.resetPassword(), authController.resetPassword )

/**
 * @desc verify account
 * @route POST /auth/verify-account/:token
 * @access Public
 */
router.get( '/verify-account/:token', authController.verifyAccount )

export default router