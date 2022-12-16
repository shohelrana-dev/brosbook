import { AbstractEntity }                from '@entities/AbstractEntity'
import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import User                              from "./User"

@Entity( 'relationships' )
export default class Relationship extends AbstractEntity {
    @ManyToOne( () => User, user => user.followings,{ eager: true} )
    @JoinColumn()
    following: User

    @ManyToOne( () => User, user => user.followers, { eager: true } )
    @JoinColumn()
    follower: User
}