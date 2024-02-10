'use client'
import { Button } from '@nextui-org/react';
import { BiErrorCircle as ErrorIcon } from 'react-icons/bi';
import { IoReload as ReloadIcon } from 'react-icons/io5';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
   return (
      <div className="w-full h-full flex flex-col items-center justify-center py-5 mt-12">
         <div className="mb-5">
            <ErrorIcon size={40} className="text-gray-700" />
         </div>
         <h2 className="text-lg font-bold text-gray-900 mb-3">
            An error has occured: {error.message}.
         </h2>
         <Button color="primary" onClick={reset} className="flex flex-wrap">
            <ReloadIcon size={20} />
            &nbsp;Try again
         </Button>
      </div>
   )
}
