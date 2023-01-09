import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn( 'uuid' )
    readonly id: string

    @CreateDateColumn()
    readonly createdAt: Date

    @UpdateDateColumn()
    readonly updatedAt: Date

    @DeleteDateColumn( { select: false } )
    readonly deletedAt: Date
}