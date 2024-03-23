'use client'
import { AnimatePresence, motion } from 'framer-motion'
import Loader from '~/components/ui/Loader'

export default function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
    return (
        <AnimatePresence>
            {isLoading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='absolute left-0 top-0 w-full h-full rounded-2xl bg-[#ffffffc9] flex flex-wrap justify-center items-center z-40'
                >
                    <Loader loading={isLoading} />
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}
