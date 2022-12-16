import { Entity, ManyToOne } from 'typeorm'
import { AbstractEntity }    from './AbstractEntity'
import Post                  from './Post'
import User                  from './User'

@Entity( 'post_likes' )
export default class PostLike extends AbstractEntity {
    @ManyToOne( () => User, { eager: true } )
    user: User

    @ManyToOne( () => Post, { eager: true } )
    post: Post
}