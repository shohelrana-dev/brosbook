import React, {useEffect, useState} from 'react'
import Modal, {ModalTransition} from '@atlaskit/modal-dialog'
import { ImCross as CrossIcon } from "react-icons/im"
import ButtonOutline from "@components/common/ButtonOutline"
import PasswordInput from "@components/common/PasswordInput"
import Link from "next/link"
import Button from "@components/common/Button"
import {useChangeUsernameMutation} from "@services/accountApi"
import {ChangeUsernamePayload} from "@interfaces/account.interfaces"
import {toast} from "react-toastify"
import {useForm} from "@hooks/useForm"
import AnimatedInput from "@components/common/AnimatedInput"

export default function ChangeUsernameModal() {
    const [changeUsername, { isLoading, isSuccess }] = useChangeUsernameMutation()
    const {formData, onChange, onSubmit, errors} = useForm<ChangeUsernamePayload>(changeUsername)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    useEffect(()=> {
        if(isSuccess) toast.success('Username was changed successfully.')
    }, [isSuccess])

    return (
        <>
            <ButtonOutline onClick={toggleModal} type="button">
                Change
            </ButtonOutline>

            <ModalTransition>
                {isModalOpen ? (
                    <Modal onClose={toggleModal}>
                        <div className="flex justify-end p-1">
                            <button className="icon" onClick={toggleModal}>
                                <CrossIcon size="15"/>
                            </button>
                        </div>
                        <form className="flex-auto p-3 px-8 pt-6 pb-12" onSubmit={onSubmit}>
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
                ): null}
            </ModalTransition>
        </>
    )
}
