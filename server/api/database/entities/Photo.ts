import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, BaseEntity
}                    from 'typeorm'
import { PhotoSource } from "@api/enums"

@Entity( 'photos' )
export default class Photo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column( { type: 'int', nullable: false } )
    userId: number

    @Column( { type: 'int', nullable: true } )
    sourceId: number

    @Column( { nullable: false, type: 'enum', enum: PhotoSource } )
    source: PhotoSource

    @Column( { nullable: false } )
    name: string

    @Column( { nullable: false } )
    type: string

    @Column( { nullable: false } )
    url: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}