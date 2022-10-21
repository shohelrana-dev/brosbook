import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, BaseEntity, JoinColumn, OneToOne
}           from 'typeorm'
import User from "./User"

@Entity( 'following_relationships' )
export default class FollowingRelationship extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { nullable: false, type: 'int' } )
    followingUserId: number

    @Column( { nullable: false, type: 'int' } )
    followerUserId: number

    @OneToOne( () => User )
    @JoinColumn( { name: 'followingUserId', referencedColumnName: 'id' } )
    following: User

    @OneToOne( () => User )
    @JoinColumn( { name: 'followerUserId', referencedColumnName: 'id' } )
    follower: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}