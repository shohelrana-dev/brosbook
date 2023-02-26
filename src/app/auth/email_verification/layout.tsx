import React, { PropsWithChildren } from 'react'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Email Verification'
}

export default function Layout( { children }: PropsWithChildren ){
    return children
}