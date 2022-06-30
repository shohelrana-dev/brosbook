import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, JoinColumn, ManyToOne, OneToMany
}           from "typeorm"
import Post from "./Post"
import User from "./User"
import Like from "./Like"
import post from "./Post";

@Entity( 'comments' )
class Comment extends BaseEntity {
    static currentUsername: string

    @PrimaryGeneratedColumn()
    id: number

    @Column( { type: 'int', nullable: false } )
    postId: number

    @Column( { length: 25, nullable: false } )
    username: string

    @Column( { type: 'text', nullable: true } )
    content: string

    @ManyToOne( () => User )
    @JoinColumn( { name: 'username', referencedColumnName: 'username' } )
    user: User

    @ManyToOne( () => Post )
    @JoinColumn( { name: 'postId', referencedColumnName: 'id' } )
    post: Post

    @OneToMany( () => Like, like => like.comment )
    @JoinColumn( { name: 'id', referencedColumnName: 'commentId' } )
    likes: Like[]

    //virtual columns
    likeCount: number
    hasCurrentUserLike: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Comment