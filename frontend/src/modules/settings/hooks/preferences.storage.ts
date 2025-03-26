// src/modules/settings/preferences.storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

const PREFERENCES_KEY = '@user_preferences'

export type Preferences = {
	notifications: boolean
	soundEffects: boolean
	vibration: boolean
}

// Сохранить настройки
export async function savePreferences(prefs: Preferences) {
	try {
		const jsonValue = JSON.stringify(prefs)
		await AsyncStorage.setItem(PREFERENCES_KEY, jsonValue)
	} catch (e) {
		console.error('Error saving preferences:', e)
	}
}

// Загрузить настройки
export async function loadPreferences(): Promise<Preferences> {
	try {
		const jsonValue = await AsyncStorage.getItem(PREFERENCES_KEY)
		if (jsonValue != null) {
			return JSON.parse(jsonValue)
		} else {
			// если нет сохраненных данных, используем дефолт
			return {
				notifications: true,
				soundEffects: true,
				vibration: true,
			}
		}
	} catch (e) {
		console.error('Error loading preferences:', e)
		// вернем какие-то дефолтные
		return {
			notifications: true,
			soundEffects: true,
			vibration: true,
		}
	}
}
