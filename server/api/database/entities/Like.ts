import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, BaseEntity
} from 'typeorm'

import Post    from './Post'
import User    from './User'
import Comment from './Comment'

@Entity( 'likes' )
export default class Like extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column( { length: 25, nullable: false } )
    username: string

    @Column( { type: 'int', nullable: true } )
    postId: number

    @Column( { type: 'int', nullable: true } )
    commentId: number

    @ManyToOne( () => User )
    @JoinColumn( { name: 'username', referencedColumnName: 'username' } )
    user: User

    @ManyToOne( () => Post )
    @JoinColumn( { name: 'postId', referencedColumnName: 'id' } )
    post: Post

    @ManyToOne( () => Comment )
    @JoinColumn( { name: 'commentId', referencedColumnName: 'id' } )
    comment: Comment

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}