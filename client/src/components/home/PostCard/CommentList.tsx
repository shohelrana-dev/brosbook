import React, { FormEvent, useEffect, useState } from 'react'
import { useSelector }                           from "react-redux"
import { toast }                                 from "react-toastify"
import { CircularProgress }                      from "@mui/material"

import Avatar           from "@components/common/Avatar"
import CommentsSkeleton from "@components/home/Skeletons/CommentsSkeleton"
import CommentItem      from "@components/home/PostCard/CommentItem"
import { Comment }      from "@interfaces/posts.interfaces"
import { RootState }    from "@store/index"
import { PaginateMeta } from "@interfaces/index.interfaces"
import commentsApi      from "@api/comments"

interface CommentListPost {
    postId: number
    clickComment: boolean
}

function CommentList( { postId, clickComment }: CommentListPost ){
    //hooks
    const currentUser                             = useSelector( ( state: RootState ) => state.auth.user )
    const [comments, setComments]                 = useState<Comment[]>( [] )
    const [commentsMeta, setCommentsMeta]         = useState<PaginateMeta>( {} as PaginateMeta )
    const [isLoadingComments, setLoadingComments] = useState<boolean>( false )
    const [isShowComment, setShowComment]         = useState<boolean>( false )

    // @ts-ignore
    useEffect( () => {
        if( ! isShowComment && clickComment ){
            fetchComments( 1 )
        }
    }, [isShowComment, clickComment] )

    async function fetchComments( page: number, postsParPage?: number ){
        setLoadingComments( true )

        try {
            const { data } = await commentsApi.fetchComments( postId, page, postsParPage )
            setComments( [...comments, ...data?.comments] )
            setCommentsMeta( data?.meta || {} )
        } catch ( err: any ) {
            console.error( err?.response?.data?.message )
        } finally {
            setShowComment( true )
            setLoadingComments( false )
        }
    }

    async function handleSaveComment( event: FormEvent<HTMLFormElement> ){
        event.preventDefault()

        const form    = event.target as HTMLFormElement
        const comment = form.comment.value?.trim()
        if( ! comment ) return

        try {
            const { data } = await commentsApi.saveComment( comment, postId )
            //set comment and show success message
            setComments( [...comments, data.comment] )
            toast.success( data.message )
            form.reset()
        } catch ( err: any ) {
            const message = err.response?.data?.message || ''
            toast.error( message )
        }
    }

    return (
        <div className="mt-2">
            <form onSubmit={ handleSaveComment } className="mb-2 flex items-center">
                <Avatar src={ currentUser.photo } online size="small"/>
                <input type="text" name="comment" className="input-basic rounded-full bg-theme-gray ml-2"
                       placeholder="Write a comment..."/>
            </form>

            { comments.length > 0 && comments.map( comment => (
                <CommentItem comment={ comment } key={ comment.id }/>
            ) ) }

            { isShowComment && !! commentsMeta.nextPage && (
                <button
                    className="button mt-2 py-2 disabled:cursor-default min-w-[150px]"
                    disabled={ isLoadingComments }
                    onClick={ () => fetchComments( commentsMeta.nextPage ) }
                >
                    { isLoadingComments ? <CircularProgress size={ 16 }/> : 'See mor comments' }
                </button>
            ) }

            { isLoadingComments && <CommentsSkeleton/> }


            { isShowComment && comments.length < 1 && (
                <p className="mt-3">No comments</p>
            ) }

        </div>
    )
}

export default CommentList