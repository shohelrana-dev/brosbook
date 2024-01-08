import { useState } from 'react'

export default function useToggle(initialActive = false): [boolean, () => void] {
	const [isActive, setActive] = useState(initialActive)

	function toggle() {
		setActive(!isActive)
	}

	return [isActive, toggle]
}
