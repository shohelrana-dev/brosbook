import { Router } from "express"
import authMiddleware from "@middleware/auth.middleware"
import NotificationService from "@modules/notifications/notification.service"
import NotificationController from "@modules/notifications/notification.controller"

const router                 = Router()
const notificationService    = new NotificationService()
const notificationController = new NotificationController( notificationService )

/**
 * @desc get notifications
 * @route GET /api/v1/notifications
 * @access Private
 */
router.get( '/', authMiddleware, notificationController.getMany )

/**
 * @desc update all notifications
 * @route PUT /api/v1/notifications
 * @access Private
 */
router.put( '/', authMiddleware, notificationController.updateAll )

/**
 * @desc get notifications count
 * @route GET /api/v1/notifications/unread_count
 * @access Private
 */
router.get( '/unread_count', authMiddleware, notificationController.getUnreadCount )

/**
 * @desc update notification
 * @route GET /api/v1/notifications/notificationId
 * @access Private
 */
router.put( '/:notificationId', authMiddleware, notificationController.update )


export default router