import { ChangeEvent, useRef, useState } from 'react'

export default function useSelectFile() {
	const inputRef = useRef<HTMLInputElement>(null)
	const [selectedFile, setSelectedFile] = useState<Blob | null>(null)

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setSelectedFile(event.target.files?.[0] || null)
	}

	function handleClick() {
		inputRef.current?.click()
	}

	function removeSelectedFile() {
		setSelectedFile(null)

		if (inputRef.current?.value) {
			inputRef.current.value = ''
		}
	}

	return { inputRef, handleChange, selectedFile, handleClick, removeSelectedFile }
}
