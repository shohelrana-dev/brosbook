import { Router } from "express"

import authMiddleware from "@middleware/auth.middleware"
import ChatController from "@modules/chat/chat.controller"
import ChatService    from "./chat.service"

const router         = Router()
const chatController = new ChatController( new ChatService() )

/**
 * @desc get all conversations
 * @route GET /chat/conversations
 * @access Private
 */
router.get( '/conversations', authMiddleware, chatController.getConversations )

/**
 * @desc create conversation
 * @route POST /chat/conversations
 * @access Private
 */
router.post( '/conversations', authMiddleware, chatController.createConversation )

/**
 * @desc search conversation
 * @route GET user/search
 * @access Private
 */
router.get( '/conversations/search', authMiddleware, chatController.searchConversation )

/**
 * @desc get one conversation
 * @route GET /chat/conversations
 * @access Private
 */
router.get( '/conversations/:identifier', authMiddleware, chatController.getOneConversation )

/**
 * @desc get messages
 * @route GET /chat/messages/:participant
 * @access Private
 */
router.get( '/messages/:identifier', authMiddleware, chatController.getMessages )


export default router