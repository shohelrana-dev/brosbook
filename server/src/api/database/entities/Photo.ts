import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, BaseEntity
}                    from 'typeorm'
import { PhotoType } from "../../enums"

@Entity( 'photos' )
export default class Photo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { type: 'int', nullable: false } )
    userId: number

    @Column( { type: 'int', nullable: true } )
    sourceId: number

    @Column( { nullable: true } )
    caption: string

    @Column( { nullable: false } )
    name: string

    @Column( { nullable: false } )
    url: string

    @Column( { nullable: false, type: 'enum', enum: PhotoType } )
    type: PhotoType

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}