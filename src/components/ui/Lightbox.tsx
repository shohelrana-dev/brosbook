'use client'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { ReactNode, useEffect, useRef } from 'react'

interface Props {
	className?: string
	children?: ReactNode
}

export default function Lightbox({ className, children }: Props) {
	const containerIdRef = useRef(`gallery-${Date.now()}`)
	const containerId = containerIdRef.current

	useEffect(() => {
		Fancybox.bind(`#${containerId} a`, {
			groupAll: true,
		})

		return () => {
			Fancybox.unbind(`#${containerId} a`)
			Fancybox.close()
		}
	}, [containerId])

	return (
		<div id={containerId} className={className}>
			{children}
		</div>
	)
}
