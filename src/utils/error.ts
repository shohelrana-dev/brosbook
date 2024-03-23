import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

type ErrorResponse = FetchBaseQueryError | SerializedError | undefined

export function extractErrors<T>(error: ErrorResponse): T {
    if (
        error &&
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'errors' in error.data
    ) {
        return (error.data.errors as T) || ({} as T)
    }
    return {} as T
}

export function extractErrorMessage(error: ErrorResponse): string | null {
    if (
        error &&
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
    ) {
        return error.data.message as string
    } else if (!navigator.onLine) {
        return 'Network error! Please chack your internet connection.'
    } else if (error && 'error' in error && typeof error.error === 'string') {
        return error.error
    }

    return null
}
