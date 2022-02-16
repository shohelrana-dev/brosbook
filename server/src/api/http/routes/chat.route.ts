import { Router } from "express"

import { ensureAuth } from "@middleware/auth"
import ChatController from "@controllers/chat.controller"
import ChatService    from "@services/chat.service"

const router         = Router()
const chatController = new ChatController( new ChatService() )

/**
 * @desc get all conversations
 * @route GET /chat/conversations
 * @access Private
 */
router.get( '/conversations', ensureAuth, chatController.getConversations )

/**
 * @desc create conversation
 * @route POST /chat/conversations
 * @access Private
 */
router.post( '/conversations', ensureAuth, chatController.createConversation )

/**
 * @desc search conversation
 * @route GET user/search
 * @access Private
 */
router.get( '/conversations/search', ensureAuth, chatController.searchConversation )

/**
 * @desc get one conversation
 * @route GET /chat/conversations
 * @access Private
 */
router.get( '/conversations/:identifier', ensureAuth, chatController.getOneConversation )

/**
 * @desc get messages
 * @route GET /chat/messages/:participant
 * @access Private
 */
router.get( '/messages/:identifier', ensureAuth, chatController.getMessages )


export default router