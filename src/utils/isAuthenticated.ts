import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import getAuthorizationConfig from '~/utils/getAuthorizationConfig'

export default async function isAuthenticated(cookies: RequestCookies | ReadonlyRequestCookies) {
	const access_token = cookies.get('access_token')?.value
	if (!access_token) return false

	const endpoint = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/users/me`
	const config = getAuthorizationConfig(cookies)

	try {
		const res = await fetch(endpoint, config)

		if (!res.ok) return false

		const user = await res.json()

		return !!user?.id
	} catch (err) {
		return false
	}
}
