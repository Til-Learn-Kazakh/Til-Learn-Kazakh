import React, { createContext, useContext, useEffect, useState } from 'react'

import { Preferences, loadPreferences, savePreferences } from './preferences.storage'

type PreferencesContextType = {
	preferences: Preferences
	togglePreference: (key: keyof Preferences) => void
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [preferences, setPreferences] = useState<Preferences>({
		notifications: true,
		soundEffects: true,
		vibration: true,
	})

	useEffect(() => {
		loadPreferences().then(prefs => setPreferences(prefs))
	}, [])

	const togglePreference = (key: keyof Preferences) => {
		const updated = { ...preferences, [key]: !preferences[key] }
		setPreferences(updated)
		savePreferences(updated)
	}

	return (
		<PreferencesContext.Provider value={{ preferences, togglePreference }}>
			{children}
		</PreferencesContext.Provider>
	)
}

export function usePreferences() {
	const context = useContext(PreferencesContext)
	if (!context) throw new Error('usePreferences must be used within PreferencesProvider')
	return context
}
