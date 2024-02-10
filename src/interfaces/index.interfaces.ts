import { Post } from '~/interfaces/posts.interfaces'
import { User } from '~/interfaces/user.interfaces'

export interface ErrorResponse {
	data?: {
		statusCode: number
		message: string
		errors?: { [name: string]: string }
	}
}

export interface ListResponse<T> {
	items: T[]
	count: number
	currentPage: number
	lastPage: number
	nextPage: number
	prevPage: number
}

export interface Media {
	id: string
	source: string
	name: string
	originalName: string
	format: string
	url: string
	height: number
	width: number
	size: number
}

export enum NotificationTypes {
	LIKED_POST = 'liked_post',
	COMMENTED_POST = 'commented_post',
	LIKED_COMMENT = 'liked_comment',
	FOLLOWED = 'followed',
}

export interface Notification {
	id: string
	type: NotificationTypes
	post: Post
	comment: Comment
	readAt: string
	recipient: User
	initiator: User
	createdAt: string
}

export interface ListQueryParams {
	page?: number
	limit?: number
}
