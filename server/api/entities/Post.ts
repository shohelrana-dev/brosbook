import { Entity, Column, JoinColumn, OneToMany, ManyToOne } from "typeorm"
import Comment from "./Comment"
import User from "./User"
import Like from "./Like"
import { AbstractEntity } from "@entities/AbstractEntity"

@Entity('posts')
class Post extends AbstractEntity {
    @Column({ nullable: false, length: 48 })
    userId: string

    @Column({ type: 'text', nullable: true })
    body: string

    @Column({ nullable: true })
    photo: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User

    @OneToMany(() => Comment, comment => comment.post)
    @JoinColumn({ name: 'id', referencedColumnName: 'postId' })
    comments: Comment[]

    @OneToMany(() => Like, like => like.post)
    @JoinColumn({ name: 'id', referencedColumnName: 'postId' })
    likes: Like[]

    //virtual columns
    commentCount: number
    hasCurrentUserLike: boolean
}

export default Post