/*
import {
    BaseEntity, Entity, PrimaryGeneratedColumn,
    Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn
}           from "typeorm"
import User from "./User"

@Entity( 'conversations' )
class Conversation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { length: 20, nullable: false } )
    ownerUsername: string

    @Column( { length: 20, nullable: false } )
    participantUsername: string

    @ManyToOne( () => User )
    @JoinColumn( { name: 'participantUsername', referencedColumnName: 'username' } )
    participant: User

    @Column( { length: 50, nullable: false } )
    conversationHash: string

    @Column( { type: 'text', nullable: false } )
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

export default Conversation*/
