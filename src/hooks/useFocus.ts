import { useEffect, useRef, useState } from 'react'

export default function useFocus() {
	const inputRef = useRef<HTMLInputElement>(null)
	const [isFocused, setIsFocused] = useState(false)

	useEffect(() => {
		const inputEl = inputRef.current
		const handleFocus = () => setIsFocused(true)
		const handleBlur = () => setIsFocused(false)

		if (inputEl) {
			inputEl.addEventListener('focus', handleFocus)
			inputEl.addEventListener('blur', handleBlur)

			return () => {
				inputEl.removeEventListener('focus', handleFocus)
				inputEl.removeEventListener('blur', handleBlur)
			}
		}
	}, [])

	function focus() {
		inputRef.current?.focus()
	}

	return { inputRef, isFocused, focus }
}
