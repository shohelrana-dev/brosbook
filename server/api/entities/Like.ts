import { AbstractEntity } from '@entities/AbstractEntity'
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import Post from './Post'
import User from './User'
import Comment from './Comment'

@Entity('likes')
export default class Like extends AbstractEntity {
    @Column({ nullable: false, length: 48 })
    userId: string

    @Column({ nullable: true, length: 48 })
    postId: string

    @Column({ nullable: true, length: 48 })
    commentId: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
    post: Post

    @ManyToOne(() => Comment)
    @JoinColumn({ name: 'commentId', referencedColumnName: 'id' })
    comment: Comment
}