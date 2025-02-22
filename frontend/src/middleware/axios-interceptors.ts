import axios, {
	AxiosHeaders,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios'
import * as SecureStore from 'expo-secure-store'

import { server } from '../core/config/environment.config'

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

axiosWithAuth.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
	const accessToken = await SecureStore.getItemAsync('token')

	if (config.headers && accessToken) {
		;(config.headers as AxiosHeaders).set('Authorization', `${accessToken}`)
	}

	return config
})

axiosWithAuth.interceptors.response.use(
	(response: AxiosResponse) => {
		return response
	},
	async error => {
		return Promise.reject(error)
	}
)

export { axiosBase, axiosWithAuth }
