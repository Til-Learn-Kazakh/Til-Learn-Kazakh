import { imageserver } from '../core/config/environment.config'

import { axiosBase } from './axios-interceptors'
import { setCSRFToken } from './csrf'

export const fetchAndSetCSRFToken = async () => {
	try {
		const res = await axiosBase.get<{ csrfToken: string }>(`${imageserver}/csrf-token`)
		setCSRFToken(res.data.csrfToken)
	} catch (err) {
		console.error('❌ Не удалось получить CSRF-токен:', err)
	}
}
