import {
    AfterLoad,
    BaseEntity, BeforeInsert,
    Column, CreateDateColumn, Entity, JoinColumn, OneToMany,
    OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
}                            from "typeorm"
import bcrypt                from 'bcrypt'
import Profile               from "./Profile"
import FollowingRelationship from "./FollowingRelationship"

@Entity( 'users' )
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { length: 20, nullable: false } )
    firstName: string

    @Column( { length: 20, nullable: false } )
    lastName: string

    @Column( { unique: true, length: 25, nullable: false } )
    username: string

    @Column( { unique: true, length: 50, nullable: false } )
    email: string

    @Column( { length: 100, nullable: false } )
    password: string

    @Column( { nullable: true } )
    photo: string

    @Column( { type: 'tinyint', default: 0 } )
    active: number

    @Column( { type: 'tinyint', default: 0 } )
    verified: number

    @OneToOne( () => Profile )
    @JoinColumn()
    profile: Profile

    @OneToMany( type => FollowingRelationship, follow => follow.follower )
    followers: FollowingRelationship[]

    @OneToMany( type => FollowingRelationship, follow => follow.following )
    following: FollowingRelationship[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    //virtual columns
    fullName: string
    isCurrentUserFollow: boolean

    @BeforeInsert()
    async makePasswordHash(){
        this.password = await bcrypt.hash( this.password, 6 )
    }

    @BeforeInsert()
    generateUsernameFromEmail(){
        if( ! this.username ){
            const nameParts = this.email.split( "@" )
            this.username   = nameParts[0].toLowerCase()
        }
    }

    @BeforeInsert()
    setDefaultProfilePhotoIfNotGiven(){
        if( ! this.photo ){
            this.photo = process.env.SERVER_URL! + '/images/avatar.png'
        }
    }

    @AfterLoad()
    setFullName(){
        this.fullName = `${ this.firstName } ${ this.lastName }`
    }
}

export default User