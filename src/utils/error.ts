import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface ErrorData<T> {
   statusCode: number
   message: string
   errors?: T
}

export function getErrorData<T>(
   error: FetchBaseQueryError | SerializedError | undefined
): ErrorData<T> | undefined {
   if (error && 'status' in error) {
      return error.data as ErrorData<T> | undefined
   }
   return error as undefined
}
