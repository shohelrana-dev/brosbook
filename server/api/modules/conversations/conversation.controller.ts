import ConversationService from "./conversation.service"
import { NextFunction, Request, Response } from "express"
import { UploadedFile } from "express-fileupload";

export default class ConversationController {
    constructor( private readonly conversationService: ConversationService ){}

    public createConversation = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversation = await this.conversationService.createConversation( req.body.participantId, req.auth )

            res.json( conversation )
        } catch ( err ) {
            next( err )
        }
    }

    public getConversations = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversations = await this.conversationService.getConversations( req.query, req.auth )

            res.json( conversations )
        } catch ( err ) {
            next( err )
        }
    }

    public getConversationById = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversation = await this.conversationService.getConversationById( req.params.conversationId, req.auth )

            res.json( conversation )
        } catch ( err ) {
            next( err )
        }
    }

    public getConversationByParticipantIdOrCreate = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversation = await this.conversationService.getConversationByParticipantIdOrCreate( req.params.participantId, req.auth )

            res.json( conversation )
        } catch ( err ) {
            next( err )
        }
    }

    public getMessages = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const messages = await this.conversationService.getMessages( req.params.conversationId, req.query, req.auth )

            res.json( messages )
        } catch ( err ) {
            next( err )
        }
    }

    public sendMessage = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversationId = req.params.conversationId
            const body           = req.body.body
            const image          = req.files?.image as UploadedFile
            const type           = req.body.type
            console.log( req.files )

            const message = await this.conversationService.sendMessage( conversationId, {
                body,
                image,
                type
            }, req.auth )

            res.json( message )
        } catch ( err ) {
            next( err )
        }
    }

    public sendReaction = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const messageId = req.params.messageId
            const name      = req.body.name
            const message   = await this.conversationService.sendReaction( { messageId, name }, req.auth )

            res.json( message )
        } catch ( err ) {
            next( err )
        }
    }

    public getConversationMedia = async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const conversationId = req.params.conversationId

            const mediaList = await this.conversationService.getConversationMedia( conversationId, req.query )

            res.json( mediaList )
        } catch ( err ) {
            next( err )
        }
    }
}