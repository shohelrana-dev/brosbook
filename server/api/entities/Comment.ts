import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import Post from "./Post"
import User from "./User"
import Like from "./Like"
import { AbstractEntity } from "@entities/AbstractEntity"

@Entity('comments')
class Comment extends AbstractEntity {
    @Column({ nullable: false, length: 48 })
    postId: string

    @Column({ nullable: false, length: 48 })
    userId: string

    @Column({ type: 'text', nullable: true })
    body: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
    post: Post

    @OneToMany(() => Like, like => like.comment)
    @JoinColumn({ name: 'id', referencedColumnName: 'commentId' })
    likes: Like[]

    //virtual columns
    likeCount: number
    hasCurrentUserLike: boolean
}

export default Comment