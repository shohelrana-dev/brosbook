import React from 'react'
import Loading from "@components/global/Loading"
import { motion, AnimatePresence } from "framer-motion"
import tw from "twin.macro"

const LoadingWrapper = tw( motion.div )`absolute left-0 top-0 w-full h-full rounded-2xl bg-[#ffffffc9] flex justify-center items-center z-40`

export default function LoadingOverlay( { isLoading }: { isLoading: boolean } ){
    return (
        <AnimatePresence>
            { isLoading ? (
                <LoadingWrapper
                    initial={ { opacity: 0 } }
                    animate={ { opacity: 1 } }
                    exit={ { opacity: 0 } }
                    transition={ { duration: 0.2 } }
                >
                    <Loading color="rgb(58,141,245)"/>
                </LoadingWrapper>
            ) : null }
        </AnimatePresence>
    )
}