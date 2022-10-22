import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, BaseEntity, JoinColumn, OneToOne
}           from 'typeorm'
import User from "./User"

@Entity( 'relationships' )
export default class FollowingRelationship extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column( { nullable: false, type: 'int' } )
    followedId: number

    @Column( { nullable: false, type: 'int' } )
    followerId: number

    @OneToOne( () => User )
    @JoinColumn( { name: 'followedId', referencedColumnName: 'id' } )
    following: User

    @OneToOne( () => User )
    @JoinColumn( { name: 'followerId', referencedColumnName: 'id' } )
    follower: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}