import { AbstractEntity }            from "./AbstractEntity"
import { Entity, Column, ManyToOne } from "typeorm"
import Message                       from "./Message"
import User                          from "./User"

@Entity( 'reactions' )
class Reaction extends AbstractEntity {
    @Column( { nullable: false, length: 48 } )
    senderId: string

    @Column( { length: 10, nullable: false } )
    name: string

    @Column( { nullable: false } )
    url: string

    @ManyToOne( () => User )
    sender: User

    @ManyToOne( () => Message, message => message.reactions )
    message: Message
}

export default Reaction