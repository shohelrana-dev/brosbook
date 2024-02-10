'use client'
import { useEffect } from 'react'
import { removeCookie } from 'tiny-cookie'
import PageLoader from '~/components/ui/PageLoader'

export default function LogoutPage() {
   useEffect(() => {
      removeCookie('access_token')

      window.location.href = '/auth/login'
   })

   return <PageLoader />
}
