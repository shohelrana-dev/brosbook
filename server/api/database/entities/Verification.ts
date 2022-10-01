import {
    BaseEntity, Column, CreateDateColumn,
    Entity, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"

@Entity( 'verification' )
class Verification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { type: "int", nullable: false } )
    userId: number

    @Column( { nullable: true } )
    key: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Verification