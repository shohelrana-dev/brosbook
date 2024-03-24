'use client'
import { MotionProps, motion } from 'framer-motion'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function Transition({ children, ...rest }: Props & MotionProps) {
   return (
      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: 'easeInOut' }}
         {...rest}
      >
         {children}
      </motion.div>
   )
}
