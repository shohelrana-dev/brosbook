import {
    AfterLoad,
    BaseEntity, BeforeInsert,
    Column, CreateDateColumn, Entity, JoinColumn, OneToMany,
    OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm"
import bcrypt from 'bcrypt'
import Profile from "./Profile"
import FollowingRelationship from "./Relationship"

@Entity('users')
class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number

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

    @Column({ nullable: true })
    verificationKey: string

    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile

    @OneToMany(() => FollowingRelationship, follow => follow.follower)
    followers: FollowingRelationship[]

    @OneToMany(() => FollowingRelationship, follow => follow.following)
    following: FollowingRelationship[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    //virtual columns
    fullName: string
    isCurrentUserFollow: boolean
    hasEmailVerified: boolean

    @BeforeInsert()
    async makePasswordHash() {
        this.password = await bcrypt.hash(this.password, 6)
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
        if (!this.Media) {
            this.Media = process.env.SERVER_URL! + '/images/avatar.png'
        }
    }

    @AfterLoad()
    setFullName() {
        this.fullName = `${this.firstName} ${this.lastName}`
    }

    @AfterLoad()
    setHasEmailVerified() {
        this.hasEmailVerified = this.emailVerifiedAt !== null && !!this.emailVerifiedAt
    }
}

export default User