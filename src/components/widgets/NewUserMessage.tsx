'use client'
import Link from 'next/link'
import Button from '~/components/ui/Button'
import useAuth from '~/hooks/useAuth'

export default function NewUserMessage() {
   const { isAuthenticated } = useAuth()

   if (isAuthenticated) return null

   return (
      <div className="card p-5">
         <h2 className="text-xl font-medium mb-2">New to {process.env.NEXT_PUBLIC_APP_NAME}?</h2>
         <p className="text-gray-800">Sign up now to get your own personalized timeline!</p>

         <Button as={Link} href="/auth/signup" variant="faded" className="mt-3">
            Goto Signup page
         </Button>
      </div>
   )
}
