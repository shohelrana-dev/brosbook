import { AfterLoad, BeforeInsert, Column, Entity, OneToMany, OneToOne } from "typeorm"
import argon2 from 'argon2'
import Profile from "./Profile"
import FollowingRelationship from "./Relationship"
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
    photo: string

    @Column({ type: 'tinyint', default: 0 })
    active: number

    @Column({ type: 'datetime', nullable: true })
    emailVerifiedAt: string

    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile

    @OneToMany(() => FollowingRelationship, follow => follow.follower)
    followers: FollowingRelationship[]

    @OneToMany(() => FollowingRelationship, follow => follow.following)
    following: FollowingRelationship[]

    //virtual columns
    fullName: string
    isCurrentUserFollow: boolean
    hasEmailVerified: boolean

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
    setDefaultProfilePhotoIfNotGiven() {
        if (!this.photo) {
            this.photo = process.env.SERVER_URL! + '/avatar.png'
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