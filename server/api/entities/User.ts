import {
    AfterLoad,
    BeforeInsert,
    Column,
    Entity,
    JoinColumn, OneToMany,
    OneToOne
}                         from "typeorm"
import argon2             from 'argon2'
import Profile            from "./Profile"
import { AbstractEntity } from "@entities/AbstractEntity"
import Media              from "@entities/Media"
import { Auth }           from "@api/types/index.types"
import Relationship       from "@entities/Relationship"

@Entity( 'users' )
class User extends AbstractEntity {
    @Column( { length: 20, nullable: false } )
    firstName: string

    @Column( { length: 20, nullable: false } )
    lastName: string

    @Column( { unique: true, length: 25, nullable: false } )
    username: string

    @Column( { unique: true, length: 50, nullable: false } )
    email: string

    @Column( { length: 100, nullable: false, select: false } )
    password: string

    @OneToOne( () => Media, { eager: true} )
    @JoinColumn()
    avatar: Media

    @Column( { type: 'tinyint', default: 0 } )
    active: number

    @Column( { type: 'datetime', nullable: true } )
    emailVerifiedAt: string

    @OneToOne( () => Profile, ( profile ) => profile.user )
    profile: Profile

    @OneToMany( () => Relationship, ( relationship ) => relationship.follower )
    followers: User[]

    @OneToMany( () => Relationship, ( relationship ) => relationship.following )
    followings: User[]

    //virtual columns
    fullName: string
    isViewerFollow: boolean
    hasEmailVerified: boolean
    followersCount: number
    followingsCount: number

    @BeforeInsert()
    async makePasswordHash(){
        this.password = await argon2.hash( this.password )
    }

    @BeforeInsert()
    generateUsernameFromEmail(){
        if( ! this.username ){
            const nameParts = this.email.split( "@" )
            this.username   = nameParts[0].toLowerCase()
        }
    }

    @AfterLoad()
    setFullName(){
        this.fullName = `${ this.firstName } ${ this.lastName }`
    }

    @AfterLoad()
    setEmailVerified(){
        this.hasEmailVerified = this.emailVerifiedAt !== null && !! this.emailVerifiedAt
    }

    @AfterLoad()
    setDefaultAvatar(){
        if( ! this.avatar ){
            this.avatar = { url: `${ process.env.SERVER_URL }/avatar.png` } as Media
        }
    }

    async setViewerProperties( auth: Auth ):Promise<User>{
        const relationship = await Relationship.findOneBy( {
            follower: { id: auth.user.id },
            following: { id: this.id }
        } )

        this.isViewerFollow = Boolean( relationship )

        return this
    }
}

export default User