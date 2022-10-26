import { AbstractEntity } from "@entities/AbstractEntity"
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import User from "./User"

@Entity('conversations')
class Conversation extends AbstractEntity {
    @Column({ length: 55, nullable: false })
    identifier: string

    @Column({ nullable: false, length: 48 })
    ownerId: string

    @Column({ nullable: false, length: 48 })
    participantId: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'participantId', referencedColumnName: 'id' })
    participant: User

    @Column({ type: 'text', nullable: true })
    lastMessage: string

    @Column({ type: 'tinyint', default: 0 })
    seen: number

    @Column({ type: 'int', nullable: true })
    unseenCount: number
}

export default Conversation