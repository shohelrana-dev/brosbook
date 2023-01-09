import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm'
import { AbstractEntity } from "@entities/AbstractEntity"
import Post from "@entities/Post"
import Comment from "@entities/Comment"
import User from "@entities/User"

export enum NotificationTypes {
    LIKED_POST     = 'liked_post',
    COMMENTED_POST = 'commented_post',
    LIKED_COMMENT  = 'liked_comment',
    FOLLOWED       = 'followed',
}

@Entity( 'notifications' )
export class Notification extends AbstractEntity {
    @Column( { type: 'enum', enum: NotificationTypes, nullable: false } )
    type: NotificationTypes

    @ManyToOne( () => Post )
    post: Post

    @ManyToOne( () => Comment )
    comment: Comment

    @Column( { type: 'datetime', nullable: true } )
    readAt: string

    @ManyToOne( () => User, { nullable: false } )
    recipient: User

    @ManyToOne( () => User, { eager: true, nullable: false } )
    initiator: User

    //virtual column
    isRead: boolean

    @AfterLoad()
    setIsRead(){
        this.isRead = !! this.readAt
    }
}