import axios, {
	AxiosHeaders,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios'
import * as SecureStore from 'expo-secure-store'

import { server } from '../core/config/environment.config'

import { getCSRFToken } from './csrf'

const options: AxiosRequestConfig = {
	baseURL: server,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	maxRedirects: 0, // Отключаем автоматические редиректы
}

const axiosBase = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosBase.interceptors.request.use(async config => {
	const token = await getCSRFToken()
	if (token && config.method !== 'get') {
		;(config.headers as AxiosHeaders).set('X-CSRF-Token', token)
	}
	return config
})

axiosWithAuth.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
	const accessToken = await SecureStore.getItemAsync('token')

	if (config.headers && accessToken) {
		;(config.headers as AxiosHeaders).set('Authorization', `${accessToken}`)
	}
	const token = await getCSRFToken()
	if (token && config.method !== 'get') {
		;(config.headers as AxiosHeaders).set('X-CSRF-Token', token)
	}

	return config
})

axiosWithAuth.interceptors.response.use(
	(response: AxiosResponse) => response,
	async error => {
		const originalRequest = error.config

		// Если ошибка 401 и запрос не был повторён ранее
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				const refreshToken = await SecureStore.getItemAsync('refresh_token')
				if (!refreshToken) throw new Error('No refresh token')

				const res = await axiosBase.post<{ access_token: string }>(`${server}/auth/refresh`, {
					refresh_token: refreshToken,
				})

				const newAccessToken = res.data.access_token

				await SecureStore.setItemAsync('token', newAccessToken)

				originalRequest.headers['Authorization'] = `${newAccessToken}`

				return axiosWithAuth(originalRequest)
			} catch (refreshError) {
				console.error('Ошибка при обновлении токена:', refreshError)
				// Очистка токенов, если обновление не удалось
				await SecureStore.deleteItemAsync('token')
				await SecureStore.deleteItemAsync('refresh_token')
			}
		}

		return Promise.reject(error)
	}
)

export { axiosBase, axiosWithAuth }
