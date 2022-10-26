import { AbstractEntity } from "@entities/AbstractEntity"
import { Entity, Column, JoinColumn, OneToMany } from "typeorm"
import Reaction from "./Reaction"

@Entity('messages')
class Message extends AbstractEntity {
    @Column({ length: 55, nullable: false })
    conversationIdentifier: string

    @Column({ nullable: false, length: 48 })
    senderId: string

    @Column({ type: 'text', nullable: true })
    body: string

    @Column({ nullable: true })
    image: string

    @Column({
        type: 'enum',
        enum: ['text', 'image', 'emoji'],
        default: 'text'
    }
    )
    type: string

    @OneToMany(() => Reaction, reaction => reaction.message)
    @JoinColumn({ name: 'id', referencedColumnName: 'messageId' })
    reactions: Reaction[]
}

export default Message