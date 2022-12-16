import { Router }          from "express"
import authMiddleware      from "@middleware/auth.middleware"
import ChatController      from "./conversation.controller"
import ConversationService from "./conversation.service"

const router                 = Router()
const conversationService    = new ConversationService()
const conversationController = new ChatController( conversationService )

/**
 * @desc get all conversations
 * @route GET /api/v1/conversations
 * @access Private
 */
router.get( '/', authMiddleware, conversationController.getConversations )

/**
 * @desc create conversation
 * @route POST /api/v1/conversations
 * @access Private
 */
router.post( '/', authMiddleware, conversationController.createConversation )

/**
 * @desc search conversation
 * @route GET user/search
 * @access Private
 */
router.get( '/search', authMiddleware, conversationController.searchConversation )

/**
 * @desc get one conversation
 * @route GET /api/v1/conversations/:conversationId
 * @access Private
 */
router.get( '/:conversationId', authMiddleware, conversationController.getOneConversation )

/**
 * @desc get messages
 * @route GET /api/v1/conversations/:conversationId/messages
 * @access Private
 */
router.get( '/:conversationId/messages', authMiddleware, conversationController.getMessages )


export default router