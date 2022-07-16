import {
    BaseEntity, Column, CreateDateColumn,
    Entity, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"

@Entity( 'profile' )
class Profile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { length: 20, nullable: false } )
    username: string

    @Column( { length: 16, nullable: true } )
    phone: string

    @Column( { length: 255, nullable: true } )
    coverPhoto: string

    @Column( {
        type: 'enum',
        enum: [ 'male', 'female' ],
        default: 'male'
    } )
    gender: string

    @Column( { type: 'text', nullable: true } )
    bio: string

    @Column( { nullable: true } )
    location: string

    @Column( { type: 'date', nullable: true } )
    birthdate: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Profile