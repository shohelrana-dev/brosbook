'use client'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import TextOverflow from 'react-text-overflow'
import Transition from '~/components/ui/Transition'
import useAuth from '~/hooks/useAuth'

export default function GeneralSettingsPage() {
   const { user, isAuthenticated } = useAuth({ require: true })

   if (!isAuthenticated) return null

   return (
      <Transition style={{ padding: 16 }}>
         <div className="mb-7">
            <h3 className="text-base sm:text-lg mb-3">Account settings</h3>
            <small className="text-gray-500">ACCOUNT PREFERENCES</small>
            <hr />
         </div>
         <div className="mt-3">
            <div className="flex flex-wrap justify-between">
               <div className="mr-1">
                  <h4 className="text-base">Email address</h4>
                  <p className="text-xs text-gray-500">
                     <TextOverflow
                        text={`${user?.email} ${!user?.hasEmailVerified ? 'Not verified!' : ''}`}
                     />
                  </p>
               </div>
               <div>
                  <Button color="primary" variant="bordered" radius="full" isDisabled>
                     Change
                  </Button>
               </div>
            </div>
            <div className="flex flex-wrap justify-between mt-5">
               <div className="mr-1">
                  <h4 className="text-base">Username</h4>
                  <p className="text-xs text-gray-500">
                     <TextOverflow text={user?.username!} />
                  </p>
               </div>

               <Button
                  as={Link}
                  href="/account/username"
                  color="primary"
                  variant="bordered"
                  radius="full"
               >
                  Change
               </Button>
            </div>
            <div className="flex justify-between mt-5">
               <div className="mr-1">
                  <h4 className="text-base">Change password</h4>
                  <p className="text-xs text-gray-500">
                     <TextOverflow text="Password must be at least 8 characters long" />
                  </p>
               </div>

               <Button
                  as={Link}
                  href="/account/password"
                  color="primary"
                  variant="bordered"
                  radius="full"
               >
                  Change
               </Button>
            </div>
         </div>
      </Transition>
   )
}
