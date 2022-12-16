import ConversationService                 from "./conversation.service"
import { NextFunction, Request, Response } from "express"

export default class ChatController {
    constructor( private readonly chatService: ConversationService ){
    }

    public getMessages = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const messages = await this.chatService.getMessages( req )

            res.json( messages )
        } catch ( err ) {
            next( err )
        }
    }

    public getConversations = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversations = await this.chatService.getConversations( req )

            res.json( conversations )
        } catch ( err ) {
            next( err )
        }
    }

    public getOneConversation = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversation = await this.chatService.getOneConversation( req )

            res.json( conversation )
        } catch ( err ) {
            next( err )
        }
    }

    public createConversation = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversation = await this.chatService.createConversation( req.body.participantId, req.auth )

            res.json( conversation )
        } catch ( err ) {
            next( err )
        }
    }


    public searchConversation = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const users = await this.chatService.searchConversation( req )

            res.json( users )
        } catch ( err ) {
            next( err )
        }
    }

}