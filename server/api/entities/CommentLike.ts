import { AfterInsert, Entity, ManyToOne } from 'typeorm'
import { AbstractEntity }                 from './AbstractEntity'
import User                               from './User'
import Comment                            from "./Comment"
import { appDataSource }                  from "@config/data-source"

@Entity( 'comment_likes' )
export default class CommentLike extends AbstractEntity {
    @ManyToOne( () => User )
    user: User

    @ManyToOne( () => Comment )
    comment: Comment

    @AfterInsert()
    updateCommentLikesCount(){
        const commentRepo      = appDataSource.getRepository( Comment )
        const commentLikesRepo = appDataSource.getRepository( CommentLike )

        commentLikesRepo.countBy( { comment: { id: this.comment.id } } ).then( ( count ) => {
            commentRepo.update( { id: this.comment.id }, { likesCount: count } )
        } )
    }
}