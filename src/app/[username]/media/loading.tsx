import React from 'react'
import Loader from "@/components/global/Loader"

export default function PageLoading(){
    return (
        <div className="box text-center py-3 bg-white">
            <Loader/>
        </div>
    )
}