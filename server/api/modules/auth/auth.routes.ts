import { Router } from "express"

import AuthController           from "@modules/auth/auth.controller"
import AuthService              from "./auth.service"
import AuthValidation           from "@modules/auth/auth.validation"
import { ensureAuth }           from "@middleware/auth.middleware"
import { validationMiddleware } from "@middleware/validation.middleware"

const router         = Router()
const authController = new AuthController( new AuthService() )
const validation     = new AuthValidation()
/**
 * @desc signup user
 * @route POST /api/v1/auth/signup
 * @access Public
 */
router.post( '/signup', [...validation.signup(), validationMiddleware], authController.signup )

/**
 * @desc local login
 * @route POST /api/v1/auth/login
 * @access Public
 */
router.post( '/login', [...validation.login(), validationMiddleware], authController.login )

/**
 * @desc google login
 * @route POST /api/v1/auth/google
 * @access Public
 */
router.post( '/google', authController.google )

/**
 * @desc make log in user
 * @route GET /api/v1/auth/me
 * @access Protected
 */
router.get( '/me', ensureAuth, authController.me )

/**
 * @desc forgot password
 * @route GET /api/v1/auth/forgot-password
 * @access Public
 */
router.post( '/forgot-password', [...validation.forgotPassword(), validationMiddleware], authController.forgotPassword )

/**
 * @desc reset password
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
router.post( '/reset-password', [...validation.resetPassword(), validationMiddleware], authController.resetPassword )

/**
 * @desc verify email
 * @route GET /api/v1/auth/email/verify
 * @access Public
 */
router.get( '/email/verify', authController.verifyEmail )

/**
 * @desc resend verification link
 * @route POST /api/v1/auth/email/resend-verification-link
 * @access Public
 */
router.post( '/email/resend-verification-link', authController.resendVerificationLink )

export default router