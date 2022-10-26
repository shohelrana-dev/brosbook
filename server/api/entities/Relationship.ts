import { AbstractEntity } from '@entities/AbstractEntity'
import { Entity, Column, JoinColumn, OneToOne } from 'typeorm'
import User from "./User"

@Entity('relationships')
export default class FollowingRelationship extends AbstractEntity {
    @Column({ nullable: false, length: 48 })
    followedId: string

    @Column({ nullable: false, length: 48 })
    followerId: string

    @OneToOne(() => User)
    @JoinColumn({ name: 'followedId', referencedColumnName: 'id' })
    following: User

    @OneToOne(() => User)
    @JoinColumn({ name: 'followerId', referencedColumnName: 'id' })
    follower: User
}