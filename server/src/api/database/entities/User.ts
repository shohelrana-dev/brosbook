import {
    AfterLoad,
    BaseEntity, BeforeInsert,
    Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany,
    OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm"
import bcrypt  from 'bcrypt'
import Profile from "./Profile"
import Follow  from "./Follow"

@Entity( 'users' )
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { length: 20, nullable: false } )
    firstName: string

    @Column( { length: 20, nullable: false } )
    lastName: string

    @Column( { nullable: true, select: false, insert: false, update: false } )
    fullName: string

    @Column( { unique: true, length: 25, nullable: false } )
    username: string

    @Column( { unique: true, length: 50, nullable: false } )
    email: string

    @Column( { length: 255, nullable: true } )
    photo: string

    @Column( { length: 100, nullable: false } )
    password: string

    @Column( { type: 'tinyint', default: 0 } )
    active: number

    @Column( { type: 'tinyint', default: 0 } )
    verified: number

    @OneToOne( () => Profile )
    @JoinColumn( { name: 'username', referencedColumnName: 'username' } )
    profile: Profile

    @OneToMany( type => Follow, follow => follow.follower )
    followers: Follow[]

    @OneToMany( type => Follow, follow => follow.following )
    following: Follow[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    async makePasswordHash() {
        this.password = await bcrypt.hash( this.password, 6 )
    }

    @BeforeInsert()
    async generateUsernameFromEmail() {
        if ( !this.username ) {
            const nameParts = this.email.split( "@" )
            this.username   = nameParts[0].toLocaleLowerCase()
        }
    }

    @AfterLoad()
    setFullName() {
        this.fullName = `${ this.firstName } ${ this.lastName }`
    }

    @BeforeInsert()
    async setDefaultProfilePhotoIfNotGiven() {
        if ( !this.photo ) {
            this.photo = process.env.SERVER_URL! + '/images/avatar.png'
        }
    }
}

export default User