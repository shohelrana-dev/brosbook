import React from 'react'
import Loading from "@components/global/Loading"
import { motion, AnimatePresence } from "framer-motion"

export default function FrontDropLoading( { isLoading }: { isLoading: boolean } ){
    return (
        <AnimatePresence>
            { isLoading ? (
                <motion.div
                    initial={ { opacity: 0 } }
                    animate={ { opacity: 1 } }
                    exit={ { opacity: 0 } }
                    transition={ { duration: 0.2 } }
                    className="absolute left-0 top-0 w-full h-full rounded-2xl bg-[#ffffffc9] flex justify-center items-center z-40">
                    <Loading color="rgb(58,141,245)"/>
                </motion.div>
            ) : null }
        </AnimatePresence>
    )
}