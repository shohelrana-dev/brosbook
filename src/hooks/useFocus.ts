import React, { useEffect, useRef, useState } from 'react' // Import necessary hooks directly

export default function useFocus() {
    const inputRef = useRef<HTMLInputElement>(null) // Specify type for inputRef
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        const handleFocus = () => {
            setIsFocused(true)
        }

        const handleBlur = () => {
            setIsFocused(false)
        }

        if (inputRef.current) {
            // Ensure inputRef.current exists before attaching events
            inputRef.current.addEventListener('focus', handleFocus)
            inputRef.current.addEventListener('blur', handleBlur)
        }

        return () => {
            // Cleanup function to remove event listeners
            if (inputRef.current) {
                inputRef.current.removeEventListener('focus', handleFocus)
                inputRef.current.removeEventListener('blur', handleBlur)
            }
        }
    }, [inputRef.current]) // Only re-run effect if inputRef.current changes

    function focus() {
        inputRef.current?.focus() // Use optional chaining for safety
    }

    return { inputRef, isFocused, focus }
}
