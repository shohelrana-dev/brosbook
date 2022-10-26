import { Entity, Column, } from 'typeorm'
import { PhotoSource } from "@api/enums"
import { AbstractEntity } from '@entities/AbstractEntity'

@Entity('media')
export default class Media extends AbstractEntity {
    @Column({ nullable: false, length: 48 })
    userId: string

    @Column({ nullable: false, length: 48 })
    sourceId: string

    @Column({ nullable: false, type: 'enum', enum: PhotoSource })
    source: PhotoSource

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    type: string

    @Column({ nullable: false })
    url: string
}