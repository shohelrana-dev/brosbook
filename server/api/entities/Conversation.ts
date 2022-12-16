import { AbstractEntity }                                               from "@entities/AbstractEntity"
import { Entity, Column, OneToMany, ManyToOne } from "typeorm"
import User                                                             from "./User"
import Message                                                          from "@entities/Message"

@Entity( 'conversations' )
class Conversation extends AbstractEntity {
    @ManyToOne( () => User )
    user1: User

    @ManyToOne( () => User )
    user2: User

    @OneToMany( () => Message, message => message.conversation )
    messages: Message[]

    @Column( { type: 'text', nullable: true } )
    lastMessage: string

    @Column( { type: 'datetime', nullable: true } )
    readAt: Date
}

export default Conversation