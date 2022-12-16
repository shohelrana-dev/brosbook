import { AbstractEntity }                                   from "@entities/AbstractEntity"
import { Entity, Column, OneToMany, ManyToOne } from "typeorm"
import Reaction                                             from "./Reaction"
import Conversation                                         from "@entities/Conversation"
import User                                                 from "@entities/User"

@Entity('messages')
class Message extends AbstractEntity {
    @Column({ type: 'text', nullable: true })
    body: string

    @Column({ nullable: true })
    photo: string

    @Column({
        type: 'enum',
        enum: ['text', 'image', 'emoji'],
        default: 'text'
    }
    )
    type: string

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation

    @ManyToOne(() => User)
    owner: User

    @OneToMany(() => Reaction, reaction => reaction.message)
    reactions: Reaction[]
}

export default Message