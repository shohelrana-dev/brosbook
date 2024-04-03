import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

type ErrorResponse = FetchBaseQueryError | SerializedError | undefined

export function extractErrors<T>(error: ErrorResponse): T {
    const errors = (error as any)?.data?.errors as T

    return errors || ({} as T)
}

export function extractErrorMessage(error: ErrorResponse): string | null {
    const _error = error as any

    if (_error?.data?.message) {
        return _error?.data.message
    } else if (!navigator.onLine) {
        return 'Network error! Please chack your internet connection.'
    } else if (_error?.error && typeof _error.error === 'string') {
        return _error.error
    }

    return null
}
