import { Router } from "express"

import AuthController           from "@modules/auth/auth.controller"
import AuthService              from "./auth.service"
import validationMiddleware from "@middleware/validation.middleware"
import {ForgotPasswordDTO, LoginUserDTO, ResetPasswordDTO} from "@modules/auth/auth.dto"
import {SignupUserDTO} from "@modules/auth/auth.dto"
import {EmailService} from "@services/email.service"

const router         = Router()
const authController = new AuthController( new AuthService(new EmailService()) )

/**
 * @desc signup user
 * @route POST /api/v1/auth/signup
 * @access Public
 */
router.post( '/signup', validationMiddleware(SignupUserDTO), authController.signup )

/**
 * @desc local login
 * @route POST /api/v1/auth/login
 * @access Public
 */
router.post( '/login',validationMiddleware(LoginUserDTO), authController.login )

/**
 * @desc google login
 * @route POST /api/v1/auth/google
 * @access Public
 */
router.post( '/google', authController.google )

/**
 * @desc forgot password
 * @route GET /api/v1/auth/forgot_password
 * @access Public
 */
router.post( '/forgot_password',validationMiddleware(ForgotPasswordDTO), authController.forgotPassword )

/**
 * @desc reset password
 * @route POST /api/v1/auth/forgot_password
 * @access Public
 */
router.post( '/reset_password/:token',validationMiddleware(ResetPasswordDTO), authController.resetPassword )

/**
 * @desc resend email verification link
 * @route POST /api/v1/auth/email_verification/resend
 * @access Public
 */
router.post( '/email_verification/resend', authController.resendEmailVerificationLink )

/**
 * @desc verify email
 * @route GET /api/v1/auth/email_verification/:token
 * @access Public
 */
router.get( '/email_verification/:token', authController.verifyEmail )

export default router