import { ChangeEvent, useState } from 'react'

export function useForm<T>(initialFormData: T = {} as T) {
	const [formData, setFormData] = useState<T>(initialFormData)

	function handleChange(e: ChangeEvent<any>) {
		if (!e.target.name) {
			throw Error(`name attribute missing in ${e.target}`)
		}
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	function clearFormData() {
		if (Object.keys(formData as any).length < 1) {
			return
		}
		setFormData({} as T)
	}

	return {
		formData,
		handleChange,
		setFormData,
		clearFormData,
	}
}
