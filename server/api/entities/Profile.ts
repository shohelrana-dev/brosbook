import User from "@api/entities/User"
import {
    BaseEntity, Column, CreateDateColumn,
    Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"

@Entity('profile')
class Profile extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({ type: "int", nullable: false })
    userId: number

    @Column({ length: 16, nullable: true })
    phone: string

    @Column({ nullable: true })
    coverPhoto: string

    @Column({
        type: 'enum',
        enum: ['male', 'female'],
        default: 'male'
    })
    gender: string

    @Column({ type: 'text', nullable: true })
    bio: string

    @Column({ nullable: true })
    location: string

    @Column({ type: 'date', nullable: true })
    birthdate: string

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Profile