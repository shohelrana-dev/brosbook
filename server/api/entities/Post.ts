import {Entity, Column, JoinColumn, OneToMany, ManyToOne, AfterLoad} from "typeorm"
import Comment from "./Comment"
import User from "./User"
import Like from "./Like"
import {AbstractEntity} from "@entities/AbstractEntity"
import {appDataSource} from "@config/data-source.config";

@Entity('posts')
class Post extends AbstractEntity {
    @Column({nullable: false, length: 48})
    authorId: string

    @Column({type: 'text', nullable: true})
    body: string

    @Column({nullable: true})
    photo: string

    @ManyToOne(() => User)
    @JoinColumn({name: 'authorId', referencedColumnName: 'id'})
    author: User

    @OneToMany(() => Comment, comment => comment.post)
    @JoinColumn({name: 'id', referencedColumnName: 'postId'})
    comments: Comment[]

    @OneToMany(() => Like, like => like.post)
    @JoinColumn({name: 'id', referencedColumnName: 'postId'})
    likes: Like[]

    //virtual columns
    likeCount: number
    commentCount: number
    isViewerLiked: boolean

    @AfterLoad()
    async count(): Promise<void> {
        const postRepository = appDataSource.getRepository(Post)

        const {likeCount, commentCount}  = await postRepository
            .createQueryBuilder('post')
            .leftJoin('post.likes', 'like')
            .leftJoin('post.comments', 'comment')
            .select('COUNT(like.id)', 'likeCount')
            .addSelect('COUNT(comment.id)', 'commentCount')
            .where('post.id = :id', { id: this.id })
            .getRawOne()

        this.likeCount = likeCount
        this.commentCount = commentCount
    }

    @AfterLoad()
    removePasswordProperty(){
        delete this.author.password
    }
}

export default Post