import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    OneToOne, JoinColumn
}                         from "typeorm"
import Comment            from "./Comment"
import User               from "./User"
import PostLike           from "./PostLike"
import { AbstractEntity } from "@entities/AbstractEntity"
import Media              from "@entities/Media"
import { Auth }           from "@api/types/index.types"

@Entity( 'posts' )
export default class Post extends AbstractEntity {
    @Column( { type: 'text', nullable: true } )
    body: string

    @Column( { type: 'int', default: 0 } )
    commentsCount: number

    @Column( { type: 'int', default: 0 } )
    likesCount: number

    @OneToOne( () => Media, { eager: true, nullable: true } )
    @JoinColumn()
    image: Media

    @ManyToOne( () => User, { eager: true, nullable: false } )
    author: User

    @OneToMany( () => Comment, comment => comment.post )
    comments: Comment[]

    @OneToMany( () => PostLike, like => like.post )
    likes: PostLike[]

    //virtual columns
    isViewerLiked: boolean

    async setViewerProperties( auth: Auth ): Promise<Post>{
        const like = await PostLike.findOneBy( { user: { id: auth.user.id }, post: { id: this.id } } )

        this.isViewerLiked = Boolean( like )
        if( this.author ){
            await this.author.setViewerProperties( auth )
        }

        return this
    }
}