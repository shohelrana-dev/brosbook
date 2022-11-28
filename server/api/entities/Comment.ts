import {Entity, Column, JoinColumn, ManyToOne, OneToMany, AfterLoad} from "typeorm"
import Post from "./Post"
import User from "./User"
import Like from "./Like"
import { AbstractEntity } from "@entities/AbstractEntity"
import {appDataSource} from "@config/data-source.config"

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
    isViewerLiked: boolean

    @AfterLoad()
    async count(): Promise<void> {
        const commentRepository = appDataSource.getRepository(Comment)

        const {likeCount}  = await commentRepository
            .createQueryBuilder('post')
            .leftJoin('post.likes', 'like')
            .select('COUNT(like.id)', 'likeCount')
            .where('post.id = :id', { id: this.id })
            .getRawOne()

        this.likeCount = likeCount
    }
}

export default Comment