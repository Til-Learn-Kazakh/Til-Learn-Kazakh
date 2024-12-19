import { createNotifications } from 'react-native-notificated'

const { useNotifications, NotificationsProvider } = createNotifications()

// Оборачиваем методы в более удобный интерфейс
const toast = {
	success: (message: string, title = 'Успех') => {
		const { notify } = useNotifications()
		notify('success', {
			params: {
				description: message,
				title,
			},
		})
	},
	error: (message: string, title = 'Ошибка') => {
		const { notify } = useNotifications()
		notify('error', {
			params: {
				description: message,
				title,
			},
		})
	},
	warning: (message: string, title = 'Предупреждение') => {
		const { notify } = useNotifications()
		notify('warning', {
			params: {
				description: message,
				title,
			},
		})
	},
	info: (message: string, title = 'Информация') => {
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
