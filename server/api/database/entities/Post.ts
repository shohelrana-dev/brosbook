import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, JoinColumn, OneToMany, ManyToOne, AfterLoad
}              from "typeorm"
import Comment from "./Comment"
import User    from "./User"
import Like    from "./Like"

@Entity( 'posts' )
class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { type: "int", nullable: false } )
    userId: number

    @Column( { type: 'text', nullable: true } )
    content: string

    @Column( { nullable: true } )
    photo: string

    @ManyToOne( () => User )
    @JoinColumn( { name: 'userId', referencedColumnName: 'id' } )
    user: User

    @OneToMany( () => Comment, comment => comment.post )
    @JoinColumn( { name: 'id', referencedColumnName: 'postId' } )
    comments: Comment[]

    @OneToMany( () => Like, like => like.post )
    @JoinColumn( { name: 'id', referencedColumnName: 'postId' } )
    likes: Like[]

    @Column( { nullable: true, select: false, insert: false, update: false } )
    commentCount: number

    @Column( { nullable: true, select: false, insert: false, update: false } )
    hasCurrentUserLike: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Post