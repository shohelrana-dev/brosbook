import { ChangeEvent, useRef, useState } from 'react'

export default function useSelectFile() {
    const [selectedFile, setSelectedFile] = useState<Blob>()
    const inputRef = useRef<HTMLInputElement | null>(null)

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event?.target?.files

        if (files && files.length > 0) {
            setSelectedFile(files[0])
        }
    }

    function onClick() {
        inputRef.current?.click()
    }

    function removeSelectedFile() {
        setSelectedFile(undefined)
    }

    return { selectedFile, onChange, inputRef, onClick, removeSelectedFile }
}
