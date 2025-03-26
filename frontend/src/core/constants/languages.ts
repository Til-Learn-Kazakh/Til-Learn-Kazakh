import { icons } from './index'

export type AppLanguage = {
	code: string
	label: string
	icon: typeof icons
}

export const LANGUAGES: AppLanguage[] = [
	{
		code: 'en',
		label: 'English',
		icon: icons.united_states,
	},
	{
		code: 'ru',
		label: 'Русский',
		icon: icons.russia,
	},
]
