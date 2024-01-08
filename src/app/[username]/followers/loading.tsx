import React from 'react'
import UsersSkeleton from "@/components/skeletons/UsersSkeleton"

export default function Loading(){
    return (
        <div className="box p-3">
            <UsersSkeleton/>
        </div>
    )
}