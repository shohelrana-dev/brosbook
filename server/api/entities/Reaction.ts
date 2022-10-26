import { AbstractEntity } from "@entities/AbstractEntity"
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"
import Message from "./Message"

@Entity('reactions')
class Reaction extends AbstractEntity {
  @Column({ nullable: false, length: 48 })
  messageId: string

  @Column({ nullable: false, length: 48 })
  senderId: string

  @Column({ length: 10, nullable: false })
  name: string

  @Column({ nullable: false })
  url: string

  @ManyToOne(() => Message, message => message.reactions)
  @JoinColumn({ name: 'messageId', referencedColumnName: 'id' })
  message: Message
}

export default Reaction