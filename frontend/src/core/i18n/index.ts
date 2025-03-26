import { initReactI18next } from 'react-i18next'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
// или 'expo-localization'
import i18n from 'i18next'

import en from '../locales/en.json'
import ru from '../locales/ru.json'

const resources = {
	en: { translation: en },
	ru: { translation: ru },
}

// Эта функция будет инициализировать i18n
export async function initI18n() {
	// 1) Пытаемся взять язык из AsyncStorage
	let savedLang = await AsyncStorage.getItem('appLanguage')

	// 2) Если нет, берём системный
	if (!savedLang) {
		const locales = getLocales()
		const systemLang = locales[0]?.languageCode || 'en'
		savedLang = systemLang
	}

	// 3) Инициализируем i18n
	await i18n.use(initReactI18next).init({
		resources,
		lng: savedLang, // <-- используем сохранённый или системный
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	})

	return i18n
}

export default i18n
