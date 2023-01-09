import { AbstractEntity }                        from "./AbstractEntity"
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import Message                                   from "./Message"
import User                                      from "./User"

@Entity( 'reactions' )
class Reaction extends AbstractEntity {
    @Column( { nullable: false, length: 48 } )
    messageId: string

    @Column( { length: 10, nullable: false } )
    name: string

    @Column( { nullable: false } )
    url: string

    @ManyToOne( () => User, { eager: true } )
    @JoinColumn()
    sender: User

    @ManyToOne( () => Message, message => message.reactions )
    @JoinColumn( { name: 'messageId' } )
    message: Message
}

export default Reaction