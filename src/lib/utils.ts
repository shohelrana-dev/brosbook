import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function ucfirst(str?: string) {
    if (!str) return null

    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function nl2br(str: string) {
    return str.replace(/(\r\n|\r|\n)/g, '<br/>')
}

export const isServer = typeof window === 'undefined'
