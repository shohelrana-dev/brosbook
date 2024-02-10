'use client'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { ConfirmAlertProvider } from 'react-use-confirm-alert'
import { Toaster } from 'sonner'
import { UnauthorizedPopupProvider } from '~/hooks/useUnauthorzedAlert'
import { store } from '~/store/index'

export default function Providers({ children }: PropsWithChildren) {
	const router = useRouter()

	return (
		<Provider store={store}>
			<NextUIProvider navigate={router.push}>
				<UnauthorizedPopupProvider>
					<ConfirmAlertProvider>
						{children}
						<Toaster style={{ zIndex: 99999 }} position='top-right' />
					</ConfirmAlertProvider>
				</UnauthorizedPopupProvider>
			</NextUIProvider>
		</Provider>
	)
}
