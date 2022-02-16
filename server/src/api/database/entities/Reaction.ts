import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne, JoinColumn
} from "typeorm"
import Message
  from "./Message"

@Entity( 'reactions' )
class Reaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { nullable: false } )
    messageId: number

    @Column( { nullable: false } )
    senderId: number

    @Column( { length: 10, nullable: false } )
    name: string

    @Column( { nullable: false } )
    url: string

    @ManyToOne( () => Message, message => message.reactions )
    @JoinColumn( { name: 'messageId', referencedColumnName: 'id' } )
    message: Message

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Reaction