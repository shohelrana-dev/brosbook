import { AbstractEntity }                       from "@entities/AbstractEntity"
import User                                     from "@entities/User"
import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import Media                                    from "@entities/Media"

@Entity( 'profile' )
class Profile extends AbstractEntity {
    @Column( { length: 16, nullable: true } )
    phone: string

    @OneToOne( () => Media, {eager: true} )
    @JoinColumn()
    coverPhoto: Media

    @Column( {
        type: 'enum',
        enum: ['male', 'female'],
        nullable: true
    } )
    gender: string

    @Column( { type: 'text', nullable: true } )
    bio: string

    @Column( { nullable: true } )
    location: string

    @Column( { type: 'datetime', nullable: true } )
    birthdate: string

    @OneToOne( () => User )
    @JoinColumn( { name: 'userId' } )
    user: User
}

export default Profile