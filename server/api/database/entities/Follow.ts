import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, BaseEntity, JoinColumn, OneToOne
}           from 'typeorm'
import User from "./User"

@Entity( 'follow' )
export default class Follow extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { nullable: false, type: 'int' } )
    sourceUserId: number

    @Column( { nullable: false, type: 'int' } )
    targetUserId: number

    @OneToOne( () => User )
    @JoinColumn( { name: 'sourceUserId', referencedColumnName: 'id' } )
    follower: User

    @OneToOne( () => User )
    @JoinColumn( { name: 'targetUserId', referencedColumnName: 'id' } )
    following: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}