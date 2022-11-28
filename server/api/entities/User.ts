import { AfterLoad, BeforeInsert, Column, Entity, OneToMany, OneToOne } from "typeorm"
import argon2 from 'argon2'
import Profile from "./Profile"
import Relationship from "./Relationship"
import { AbstractEntity } from "@entities/AbstractEntity"

@Entity('users')
class User extends AbstractEntity {
    @Column({ length: 20, nullable: false })
    firstName: string

    @Column({ length: 20, nullable: false })
    lastName: string

    @Column({ unique: true, length: 25, nullable: false })
    username: string

    @Column({ unique: true, length: 50, nullable: false })
    email: string

    @Column({ length: 100, nullable: false })
    password: string

    @Column({ nullable: true })
    avatar: string

    @Column({ type: 'tinyint', default: 0 })
    active: number

    @Column({ type: 'datetime', nullable: true })
    emailVerifiedAt: string

    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile

    @OneToMany(() => Relationship, relationship => relationship.follower)
    followers: Relationship[]

    @OneToMany(() => Relationship, relationship => relationship.followedUser)
    followedUsers: Relationship[]

    //virtual columns
    fullName: string
    isViewerFollow: boolean
    hasEmailVerified: boolean
    followerCount: number
    followingCount: number

    @BeforeInsert()
    async makePasswordHash() {
        this.password = await argon2.hash(this.password)
    }

    @BeforeInsert()
    generateUsernameFromEmail() {
        if (!this.username) {
            const nameParts = this.email.split("@")
            this.username = nameParts[0].toLowerCase()
        }
    }

    @BeforeInsert()
    setDefaultProfilePhoto() {
        if (!this.avatar) {
            this.avatar = process.env.SERVER_URL! + '/avatar.png'
        }
    }

    @AfterLoad()
    setFullName() {
        this.fullName = `${this.firstName} ${this.lastName}`
    }

    @AfterLoad()
    setEmailVerified() {
        this.hasEmailVerified = this.emailVerifiedAt !== null && !!this.emailVerifiedAt
    }
}

export default User