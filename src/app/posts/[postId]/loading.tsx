import React from 'react'
import PostsSkeleton from "@/components/skeletons/PostsSkeleton"

export default function PageLoading(){
    return <PostsSkeleton count={1}/>
}