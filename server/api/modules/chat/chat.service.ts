import { Request }       from "express"
import path              from "path"
import { writeFileSync } from "fs"
import { v4 as uuidv4 }  from "uuid"
import Hashids           from "hashids"
import { getRepository, Like }                      from "typeorm"

import HttpException                                from "@exceptions/http.exception"
import Conversation                                 from "@entities/Conversation"
import Message                                      from "@entities/Message"
import Reaction                                     from "@entities/Reaction"
import { MessageDataDto, ReactionDataDto }          from "@interfaces/index.interfaces"
import { HTTP_CONFLICT, HTTP_UNPROCESSABLE_ENTITY } from "@utils/httpStatusCodes"
import User                                         from "@entities/User"

const hashids = new Hashids()

class ChatService {
    public async saveMessage( messageData: MessageDataDto ) {
        let { senderId, conversationIdentifier, body, type, base64Image, imageName } = messageData

        if ( !body && !imageName ) {
            throw new HttpException( "Message body is empty.", HTTP_UNPROCESSABLE_ENTITY )
        }

        if ( ![ "text", "image", "emoji" ].includes( type ) ) {
            throw new HttpException( "Message type is not valid.", HTTP_UNPROCESSABLE_ENTITY )
        }

        //save image
        let imageUrl: string = ""
        if ( base64Image && imageName ) {
            const namePrefix = process.env.APP_NAME + "_image_"
            imageName        = namePrefix + uuidv4() + path.extname( imageName )
            imageUrl         = `${ process.env.SERVER_URL }/images/${ imageName }`
            const imagePath  = path.resolve( process.cwd(), "public/images", imageName )
            const image      = Buffer.from( base64Image )

            //save the image file
            writeFileSync( imagePath, image )
        }

        try {
            //update Conversation
            await Conversation.update( { identifier: conversationIdentifier }, { lastMessage: body || imageUrl } )

            //create the message
            const createMessage      = Message.create( {
                conversationIdentifier,
                senderId,
                type,
                body: body || null,
                image: imageUrl || null,
            } )
            const createdMessage     = await createMessage.save()
            createdMessage.reactions = []

            return createdMessage
        } catch ( e ) {
            throw new HttpException( "Message couldn't be saved", HTTP_CONFLICT )
        }
    }

    public async createConversation( req: Request ): Promise<Conversation> {
        const { participantId } = req.body
        const identifier        = hashids.encode( req.user.id + participantId + Date.now() )

        if ( !participantId ) throw new HttpException( "Participant id missing", HTTP_UNPROCESSABLE_ENTITY )

        //check conversation exists
        const conversation = await Conversation.findOne( { ownerId: req.user.id } )
        if ( conversation ) return conversation

        try {
            const conversation    = Conversation.create( {
                identifier,
                participantId,
                ownerId: req.user.id,
                lastMessage: 'Just connected'
            } )
            const conversationTwo = Conversation.create( {
                identifier,
                ownerId: participantId,
                participantId: req.user.id,
                lastMessage: 'Just connected'
            } )

            await conversationTwo.save()
            return await conversation.save()
        } catch ( err ) {
            throw new HttpException( "Conversation couldn't be created" )
        }
    }

    public async saveReaction( reactionData: ReactionDataDto ) {
        const { senderId, name, messageId } = reactionData
        const defaultReactions              = [ "love", "smile", "wow", "sad", "angry", "like" ]

        if ( !senderId || !name || !messageId ) {
            throw new HttpException( "Some field is empty.", HTTP_UNPROCESSABLE_ENTITY )
        }

        if ( !defaultReactions.includes( name ) ) {
            throw new HttpException( "Invalid reaction", HTTP_UNPROCESSABLE_ENTITY )
        }

        const url = `${ process.env.SERVER_URL! }/reactions/${ name }.png`

        const reaction = await Reaction.findOne( { senderId, messageId } )
        try {
            if ( reaction ) {
                reaction.name = name
                reaction.url  = url
                return await reaction.save()
            }
            return await Reaction.create( { senderId, messageId, url, name } ).save()
        } catch ( e ) {
            throw new HttpException( "Reaction couldn't be saved", HTTP_CONFLICT )
        }
    }

    public async getConversations( req: Request ) {
        const conversations = await Conversation.find( {
            relations: [ "participant" ],
            where: { ownerId: req.user.id },
            order: {
                updatedAt: "DESC",
            },
        } )

        if ( !Array.isArray( conversations ) ) throw new HttpException( "Conversations couldn't be fetched", HTTP_CONFLICT )

        return conversations
    }

    public async getOneConversation( req: Request ) {
        const { identifier } = req.params

        if ( !identifier ) throw new HttpException( "Identifier missing", HTTP_CONFLICT )

        try {
            return await Conversation.findOneOrFail( {
                relations: [ "participant" ],
                where: { identifier, ownerId: req.user.id },
            } )
        } catch ( e ) {
            throw new HttpException( "Conversation couldn't found", HTTP_CONFLICT )
        }
    }

    public async getMessages( req: Request ) {
        const { identifier } = req.params

        if ( !identifier ) throw new HttpException( "Identifier missing", HTTP_CONFLICT )

        try {
            return await Message.find( {
                relations: [ "reactions" ],
                where: { conversationIdentifier: identifier },
                order: {
                    createdAt: "DESC",
                },
            } )
        } catch ( err ) {
            throw new HttpException( "Messages couldn't be fetched", HTTP_CONFLICT )
        }
    }


    public async searchConversation( req: Request ) {
        const key = req.query.key as string

        try {
            return await getRepository( User ).find( {
                where: {
                    firstName: Like( `%${ key }%` ),
                }
            } )
        } catch ( err ) {
            throw new HttpException( "Users couldn't be fetched", HTTP_CONFLICT )
        }
    }
}

export default ChatService
