import {
    BaseEntity, Column, CreateDateColumn,
    Entity, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"

@Entity( 'verification' )
class Verification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { unique: true, length: 25, nullable: false } )
    username: string

    @Column( { nullable: true } )
    token: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Verification