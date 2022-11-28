import { AbstractEntity } from '@entities/AbstractEntity'
import {Entity, Column, JoinColumn, ManyToOne} from 'typeorm'
import User from "./User"

@Entity('relationships')
export default class Relationship extends AbstractEntity {
    @Column({ nullable: false, length: 48, unique: false })
    followedId: string

    @Column({ nullable: false, length: 48, unique: false })
    followerId: string

    @ManyToOne(() => User, user => user.followedUsers)
    @JoinColumn({ name: 'followedId', referencedColumnName: 'id' })
    followedUser: User

    @ManyToOne(() => User,user => user.followers)
    @JoinColumn({ name: 'followerId', referencedColumnName: 'id' })
    follower: User
}