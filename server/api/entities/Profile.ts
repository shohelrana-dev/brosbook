import { AbstractEntity } from "@entities/AbstractEntity"
import User from "@entities/User"
import { Column, Entity, JoinColumn, OneToOne } from "typeorm"

@Entity('profile')
class Profile extends AbstractEntity {
    @Column({ nullable: false, length: 48 })
    userId: string

    @Column({ length: 16, nullable: true })
    phone: string

    @Column({ nullable: true })
    coverPhoto: string

    @Column({
        type: 'enum',
        enum: ['male', 'female'],
        default: 'male',
        nullable: true
    })
    gender: string

    @Column({ type: 'text', nullable: true })
    bio: string

    @Column({ nullable: true })
    location: string

    @Column({ type: 'datetime', nullable: true })
    birthdate: string

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User
}

export default Profile