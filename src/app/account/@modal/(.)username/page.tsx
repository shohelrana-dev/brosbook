'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import Modal, { useToggle } from 'react-minimal-modal'
import { toast } from 'sonner'
import AnimatedInput from '~/components/form/AnimatedInput'
import PasswordInput from '~/components/form/PasswordInput'
import Button from '~/components/ui/Button'
import useAuth from '~/hooks/useAuth'
import { useForm } from '~/hooks/useForm'
import { ChangeUsernamePayload } from '~/interfaces/account.interfaces'
import { useChangeUsernameMutation } from '~/services/accountApi'
import { getErrorData } from '~/utils/error'

export default function ChangeUsernameModal() {
   const { user } = useAuth()
   const [changeUsername, { isLoading, error }] = useChangeUsernameMutation()
   const { formData, handleChange } = useForm<ChangeUsernamePayload>({
      username: user?.username!,
      password: '',
   })
   const [isOpen, toggle] = useToggle(true)
   const router = useRouter()
   useAuth({ require: true })

   const { errors } = getErrorData<ChangeUsernamePayload>(error) || {}

   async function handleFormSubmit(e: FormEvent) {
      e.preventDefault()

      try {
         await changeUsername(formData).unwrap()

         toast.success('Username changed.')
         handleClose()
      } catch (err: any) {
         toast.error(err?.data?.message || 'Request failed.')
      }
   }

   function handleClose() {
      toggle()

      //delay for show modal animation
      setTimeout(() => {
         router.back()
      }, 300)
   }

   return (
      <Modal open={isOpen} title="Update username" width={700} onClose={handleClose}>
         <p className="mb-6 text-gray-700 -mt-1">Set your new username using password.</p>
         <form className="form" onSubmit={handleFormSubmit} autoComplete="off">
            <AnimatedInput
               label="Username"
               name="username"
               value={formData.username}
               error={errors?.username}
               onChange={handleChange}
            />
            <div>
               <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  error={errors?.password}
                  onChange={handleChange}
               />
               <Link href="/auth/forgot_password" className="text-blue-600 text-sm block">
                  Forgot password?
               </Link>
            </div>

            <div className="text-right">
               <Button type="submit" isLoading={isLoading} className="min-w-32">
                  Update
               </Button>
            </div>
         </form>
      </Modal>
   )
}
