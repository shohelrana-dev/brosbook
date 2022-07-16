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

    @Column( { length: 25, nullable: false } )
    username: string

    @Column( { length: 25, nullable: false } )
    followingUsername: string

    @OneToOne( () => User )
    @JoinColumn( { name: 'followingUsername', referencedColumnName: 'username' } )
    follower: User

    @OneToOne( () => User )
    @JoinColumn( { name: 'username', referencedColumnName: 'username' } )
    following: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}