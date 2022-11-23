import React, {useEffect, useState} from 'react'
import ButtonOutline from "@components/common/ButtonOutline"
import PasswordInput from "@components/common/PasswordInput"
import Link from "next/link"
import Button from "@components/common/Button"
import {useChangeUsernameMutation} from "@services/accountApi"
import {ChangeUsernamePayload} from "@interfaces/account.interfaces"
import {toast} from "react-toastify"
import {useForm} from "@hooks/useForm"
import AnimatedInput from "@components/common/AnimatedInput"
import Modal from "@components/common/Modal"

export default function ChangeUsernameModal() {
    const [changeUsername, { isLoading, isSuccess }] = useChangeUsernameMutation()
    const {formData, onChange, onSubmit, errors} = useForm<ChangeUsernamePayload>(changeUsername)

    const [isModalOpen, setIsModalOpen] = useState(false)

    function handleModalOpen(){
        setIsModalOpen(!isModalOpen)
    }

    useEffect(()=> {
        if(isSuccess) toast.success('Username was changed successfully.')
    }, [isSuccess])

    return (
        <>
            <ButtonOutline onClick={handleModalOpen} type="button" size="sm">
                Change
            </ButtonOutline>

            <Modal isOpen={isModalOpen} onClose={handleModalOpen}>
                <form onSubmit={onSubmit}>
                    <h3 className="text-lg mb-3">Update username</h3>
                    <PasswordInput
                        label="Password"
                        name="password"
                        value={formData.password}
                        error={errors.password}
                        onChange={onChange}
                    />
                    <Link href="/auth/forgot_password" className="text-blue-600 text-xs">
                        Forgot password?
                    </Link>
                    <AnimatedInput
                        label="Username"
                        name="username"
                        value={formData.username}
                        error={errors.username}
                        onChange={onChange}
                    />

                    <Button type="submit" isLoading={isLoading} className="!mt-5">
                        Update
                    </Button>
                </form>
            </Modal>
        </>
    )
}
