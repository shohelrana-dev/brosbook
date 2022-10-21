import ChatService                         from "./chat.service"
import { NextFunction, Request, Response } from "express"

export default class ChatController {
    constructor( private readonly chatService: ChatService ) {
    }

    public getMessages = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const messages = await this.chatService.getMessages( req )

            res.json( {
                success: true,
                messages: messages
            } )
        } catch ( err ) {
            next( err )
        }
    }

    public getConversations = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversations = await this.chatService.getConversations( req )

            res.json( {
                success: true,
                conversations
            } )
        } catch ( err ) {
            next( err )
        }
    }

    public getOneConversation = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversation = await this.chatService.getOneConversation( req )

            res.json( {
                success: true,
                conversation
            } )
        } catch ( err ) {
            next( err )
        }
    }

    public createConversation = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversation = await this.chatService.createConversation( req )

            res.json( {
                success: true,
                message: 'Conversation has been created',
                conversation
            } )
        } catch ( err ) {
            next( err )
        }
    }



    public searchConversation = async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const users = await this.chatService.searchConversation( req )

            res.json( {
                success: true,
                users
            } )
        } catch ( err ) {
            next( err )
        }
    }

}