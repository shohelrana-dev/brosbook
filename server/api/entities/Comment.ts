import {
    Entity,
    Column,
    ManyToOne,
    OneToMany
}                         from "typeorm"
import { AbstractEntity } from "./AbstractEntity"
import Post               from "./Post"
import User               from "./User"
import PostLike           from "./PostLike"
import CommentLike        from "@entities/CommentLike"
import { Auth }           from "@api/types/index.types"

@Entity( 'comments' )
export default class Comment extends AbstractEntity {
    @Column( { type: 'text', nullable: true } )
    body: string

    @Column( { type: 'int', default: 0 } )
    likesCount: number

    @ManyToOne( () => User, { eager: true } )
    author: User

    @ManyToOne( () => Post )
    post: Post

    @OneToMany( () => CommentLike, like => like.comment )
    likes: PostLike[]

    //virtual columns
    isViewerLiked: boolean

    async setViewerProperties( auth: Auth ): Promise<Comment>{
        const like = await CommentLike.findOneBy( { user: { id: auth.user.id }, comment: { id: this.id } } )

        this.isViewerLiked = Boolean( like )
        if( this.author ){
            await this.author.setViewerProperties( auth )
        }

        return this
    }
}