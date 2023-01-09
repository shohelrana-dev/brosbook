import { Entity, Column, ManyToOne } from 'typeorm'
import { AbstractEntity }            from '@entities/AbstractEntity'
import User                          from "@entities/User"

export enum MediaSource {
    CONVERSATION = 'conversation',
    POST         = 'post',
    AVATAR       = 'avatar',
    COVER_PHOTO  = 'cover_photo',
    COMMENT      = 'comment'
}

@Entity( 'media' )
export default class Media extends AbstractEntity {
    @Column( { nullable: false } )
    name: string

    @Column( { nullable: false } )
    originalName: string

    @Column( { nullable: false } )
    url: string

    @Column( { nullable: false } )
    mimetype: string

    @Column( { type: 'bigint', nullable: true } )
    size: string

    @Column( { type: 'enum', enum: MediaSource } )
    source: MediaSource

    @ManyToOne( () => User )
    creator: User
}