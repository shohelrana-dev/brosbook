import { AbstractEntity } from "@entities/AbstractEntity"
import { Entity, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import Reaction from "./Reaction"
import Conversation from "@entities/Conversation"
import User from "@entities/User"
import Media from "@entities/Media"

export enum MessageType {
    IMAGE = 'image',
    FILE  = 'file',
    TEXT  = 'text',
    EMOJI = 'emoji',
}

@Entity( 'messages' )
class Message extends AbstractEntity {
    @Column( { type: 'text', nullable: true } )
    body: string

    @OneToOne( () => Media, { eager: true } )
    @JoinColumn()
    image: Media

    @Column( { type: 'enum', enum: MessageType, default: MessageType.TEXT } )
    type: string

    @Column( { type: 'datetime', nullable: true } )
    seenAt: Date

    @ManyToOne( () => Conversation, conversation => conversation.messages, { eager: true } )
    @JoinColumn()
    conversation: Conversation

    @ManyToOne( () => User, { eager: true } )
    @JoinColumn()
    sender: User

    @OneToMany( () => Reaction, reaction => reaction.message, { eager: true } )
    reactions: Reaction[]

    //virtual columns
    isMeSender: boolean
}

export default Message