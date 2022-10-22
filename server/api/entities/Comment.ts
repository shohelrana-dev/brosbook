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

@Entity( 'comments' )
class Comment extends BaseEntity {
    static currentUsername: string

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column( { type: 'int', nullable: false } )
    postId: number

    @Column( { type: "int", nullable: false } )
    userId: number

    @Column( { type: 'text', nullable: true } )
    body: string

    @ManyToOne( () => User )
    @JoinColumn( { name: 'userId', referencedColumnName: 'id' } )
    user: User

    @ManyToOne( () => Post )
    @JoinColumn( { name: 'postId', referencedColumnName: 'id' } )
    post: Post

    @OneToMany( () => Like, like => like.comment )
    @JoinColumn( { name: 'id', referencedColumnName: 'commentId' } )
    likes: Like[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    //virtual columns
    likeCount: number
    hasCurrentUserLike: boolean
}

export default Comment