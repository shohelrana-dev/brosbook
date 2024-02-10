import { Button } from '@nextui-org/react'
import Link from 'next/link'

export default function NotFound() {
   return (
      <div className="flex flex-wrap flex-col items-center">
         <h1 className="mt-10 text-5xl text-blue-500">404</h1>
         <h1 className=" mb-4 text-2xl text-gray-800">Page Not Found</h1>

         <Button as={Link} href="/" color="primary" variant="bordered">
            Home
         </Button>
      </div>
   )
}
