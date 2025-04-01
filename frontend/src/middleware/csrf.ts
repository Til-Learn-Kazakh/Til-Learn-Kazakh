import * as SecureStore from 'expo-secure-store'

let csrfToken: string | null = null

export const setCSRFToken = async (token: string) => {
	csrfToken = token
	await SecureStore.setItemAsync('csrf_token', token)
}

export const getCSRFToken = async (): Promise<string | null> => {
	if (csrfToken) return csrfToken

	const storedToken = await SecureStore.getItemAsync('csrf_token')
	csrfToken = storedToken
	return csrfToken
}
