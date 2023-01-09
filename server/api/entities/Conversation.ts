import { Entity, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import { AbstractEntity } from "./AbstractEntity"
import User from "./User"
import Message from "./Message"

@Entity( 'conversations' )
class Conversation extends AbstractEntity {
    @Column( { length: 48, nullable: true } )
    lastMessageId: string

    @ManyToOne( () => User )
    user1: User

    @ManyToOne( () => User )
    user2: User

    @OneToMany( () => Message, message => message.conversation )
    messages: Message[]

    @OneToOne( () => Message )
    @JoinColumn( { name: 'lastMessageId' } )
    lastMessage: Message

    //virtual column
    participant: User
}

export default Conversation