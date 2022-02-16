import {
    BaseEntity, Entity, PrimaryGeneratedColumn,
    Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn
}           from "typeorm"
import User from "./User"

@Entity( 'conversations' )
class Conversation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { length: 55, nullable: false } )
    identifier: string

    @Column( { type: 'int', nullable: false } )
    ownerId: number

    @Column( { type: 'int', nullable: false } )
    participantId: number

    @ManyToOne( () => User )
    @JoinColumn( { name: 'participantId', referencedColumnName: 'id' } )
    participant: User

    @Column( { type: 'text', nullable: true } )
    lastMessage: string

    @Column( { type: 'tinyint', default: 0 } )
    seen: number

    @Column( { type: 'int', nullable: true } )
    unseenCount: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Conversation