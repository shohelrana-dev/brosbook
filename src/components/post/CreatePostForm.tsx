'use client'
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { HiPhotograph as GalleryIcon } from 'react-icons/hi'
import { MdPublic as PublicIcon } from 'react-icons/md'
import { RxCross2 as CrossIcon } from 'react-icons/rx'
import { toast } from 'sonner'

import BasicInput from '~/components/form/BasicInput'
import Avatar from '~/components/ui/Avatar'
import Button from '~/components/ui/Button'
import DarkOverlay from '~/components/ui/DarkOverlay'
import IconButton from '~/components/ui/IconButton'
import Tooltip from '~/components/ui/Tooltip'
import useAuth from '~/hooks/useAuth'
import useSelectFile from '~/hooks/useSelectFile'
import { useCreatePostMutation } from '~/services/postsApi'

export default function CreatePostForm() {
   //hooks
   const { user, isAuthenticated } = useAuth()
   const [createPost, { isLoading }] = useCreatePostMutation()
   const [messageText, setMessageText] = useState<string>('')
   const { inputRef, handleChange, handleClick, selectedFile, removeSelectedFile } = useSelectFile()
   const [isOpen, setIsOpen] = useState(false)

   async function submitForm(e: FormEvent) {
      e.preventDefault()

      if (!messageText && !selectedFile) return

      const formData = new FormData()
      if (messageText) {
         formData.append('body', messageText)
      }
      if (selectedFile) {
         formData.append('image', selectedFile)
      }

      try {
         await createPost(formData).unwrap()
         toast.success('Post published.')
         if (messageText) setMessageText('')
         if (selectedFile) {
            removeSelectedFile()
         }
      } catch (err: any) {
         console.error(err)
         toast.error("Post couldn't be saved.")
      }
   }

   function toggleVisibility() {
      if (isOpen && messageText) setMessageText('')
      setIsOpen(!isOpen)
   }

   if (!isAuthenticated) return null

   return (
      <div className="mb-5">
         <DarkOverlay isOpen={isOpen} onClick={isOpen ? toggleVisibility : undefined} />

         {!isOpen && (
            <form onSubmit={submitForm} className="card px-4 py-6 pt-8 flex z-10 relative">
               <Avatar src={user?.avatar?.url} size="small" />
               <span className="inline-block mr-3" />
               <div className="flex-grow">
                  <BasicInput
                     placeholder="What's your mind?"
                     onValueChange={setMessageText}
                     value={isOpen ? '' : messageText}
                     onFocus={toggleVisibility}
                     className="focus:border-gray-200"
                  />
                  <div className="flex flex-wrap justify-between items-center">
                     <Tooltip content="Select image">
                        <IconButton
                           size="lg"
                           onClick={() => {
                              toggleVisibility()
                              setTimeout(handleClick, 300)
                           }}
                           className="text-primary -mt-3"
                        >
                           <GalleryIcon fontSize={22} />
                        </IconButton>
                     </Tooltip>
                     <div>
                        <Button
                           type="submit"
                           size="sm"
                           isLoading={isLoading}
                           isDisabled={isLoading || (!messageText && !selectedFile)}
                        >
                           Publish Post
                        </Button>
                     </div>
                  </div>
               </div>
            </form>
         )}

         {isOpen && (
            <div className="relative card bg-white p-4 z-20">
               <Tooltip content="Close" disableWrapper>
                  <IconButton onClick={toggleVisibility} className="absolute top-2 right-2">
                     <CrossIcon size={18} />
                  </IconButton>
               </Tooltip>

               <h1 className="text-center text-lg lg:text-xl font-bold border-b border-gray-100 mb-3 pb-2">
                  Create post
               </h1>

               <div className="flex flex-wrap items-center mb-3">
                  <Avatar src={user?.avatar?.url} />
                  <div className="ml-4">
                     <h3 className="text-base lg:text-lg font-medium">{user?.fullName}</h3>
                     <p className="flex flex-wrap text-gray-600 font-medium gap-1 items-center">
                        <PublicIcon fontSize={16} /> Public
                     </p>
                  </div>
               </div>

               <form onSubmit={submitForm}>
                  <BasicInput
                     textarea
                     placeholder="What's your mind?"
                     onValueChange={setMessageText}
                     value={messageText}
                     autoFocus
                  />
                  <input
                     ref={inputRef}
                     type="file"
                     hidden
                     name="image"
                     accept="image/*"
                     onChange={handleChange}
                  />

                  {!!selectedFile && (
                     <div className="relative max-w-sm m-auto border-3 border-gray-300 rounded-2xl">
                        <IconButton
                           color="black"
                           className="absolute right-1 top-1"
                           onClick={removeSelectedFile}
                        >
                           <CrossIcon size={15} />
                        </IconButton>

                        <Image
                           width={500}
                           height={300}
                           className="rounded-2xl"
                           src={URL.createObjectURL(selectedFile)}
                           alt="post image"
                        />
                     </div>
                  )}

                  <div className="flex flex-wrap mt-4 justify-between items-center">
                     <Tooltip content="Select image">
                        <IconButton size="lg" className="text-primary" onClick={handleClick}>
                           <GalleryIcon fontSize={24} />
                        </IconButton>
                     </Tooltip>
                     <Button
                        type="submit"
                        isLoading={isLoading}
                        isDisabled={isLoading || (!messageText && !selectedFile)}
                     >
                        Publish Post
                     </Button>
                  </div>
               </form>
            </div>
         )}
      </div>
   )
}
