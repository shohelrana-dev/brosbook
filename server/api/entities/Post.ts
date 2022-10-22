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
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column( { type: "int", nullable: false } )
    userId: number

    @Column( { type: 'text', nullable: true } )
    body: string

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

    //virtual columns
    commentCount: number
    hasCurrentUserLike: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Post