'use client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { ConfirmAlertProvider } from 'react-use-confirm-alert'
import { UnauthorizedPopupProvider } from '~/hooks/useUnauthorzedAlert'
import { store } from '~/store/index'
import theme from '~/utils/theme'

export default function Providers({ children }: PropsWithChildren) {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<UnauthorizedPopupProvider>
					<ConfirmAlertProvider>
						{children}
						<Toaster containerStyle={{ zIndex: 99999 }} />
					</ConfirmAlertProvider>
				</UnauthorizedPopupProvider>
			</ThemeProvider>
		</Provider>
	)
}
