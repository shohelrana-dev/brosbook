import { Metadata } from 'next'
import ResetPassword from '~/components/auth/ResetPassword'

export const metadata: Metadata = {
	title: 'Reset Password',
}

type Props = {
	params: { token: string }
}

export default function ResetPasswordPage({ params }: Props) {
	return <ResetPassword token={params.token} />
}
