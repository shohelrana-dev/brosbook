import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, JoinColumn, OneToMany
}               from "typeorm"
import Reaction from "./Reaction"

@Entity( 'messages' )
class Message extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column( { length: 55, nullable: false } )
    conversationIdentifier: string

    @Column( { type: 'int', nullable: false } )
    senderId: number

    @Column( { type: 'text', nullable: true } )
    body: string

    @Column( { nullable: true } )
    image: string

    @Column( {
            type: 'enum',
            enum: [ 'text', 'image', 'emoji' ],
            default: 'text'
        }
    )
    type: string

    @OneToMany( () => Reaction, reaction => reaction.message )
    @JoinColumn( { name: 'id', referencedColumnName: 'messageId' } )
    reactions: Reaction[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Message