import { t } from 'i18next'
import { createNotifications } from 'react-native-notificated'

const { useNotifications, NotificationsProvider } = createNotifications()

// Оборачиваем методы в более удобный интерфейс
const toast = {
	success: (message: string, title = t('SUCCESS.TITLE')) => {
		const { notify } = useNotifications()
		notify('success', {
			params: {
				description: message,
				title,
			},
		})
	},
	error: (message: string, title = t('ERROR.TITLE')) => {
		const { notify } = useNotifications()
		notify('error', {
			params: {
				description: message,
				title,
			},
		})
	},
	warning: (message: string, title = t('WARNING')) => {
		const { notify } = useNotifications()
		notify('warning', {
			params: {
				description: message,
				title,
			},
		})
	},
	info: (message: string, title = t('INFORMATION')) => {
		const { notify } = useNotifications()
		notify('info', {
			params: {
				description: message,
				title,
			},
		})
	},
}

export { NotificationsProvider, toast }
