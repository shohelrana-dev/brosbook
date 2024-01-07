'use client'
import { PropsWithChildren } from 'react'
import { store } from '@store/index'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { UnauthorizedPopupProvider } from '@hooks/useUnauthorzedAlert'
import { ConfirmAlertProvider } from 'react-use-confirm-alert'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@utils/theme'

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
