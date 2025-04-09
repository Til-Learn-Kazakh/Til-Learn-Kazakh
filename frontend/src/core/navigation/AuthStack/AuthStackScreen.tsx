import React, { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '../../../modules/auth/components/login/Login'
import SignUp from '../../../modules/auth/components/signup/SignUp'
import SelectLanguageScreen from '../../../modules/welcome/pages/SelectLanguagePage'
import Welcome from '../../../modules/welcome/pages/Welcome'
import { LoadingUi } from '../../ui/LoadingUi'

export type AuthStackParamList = {
	Welcome: undefined
	SignUp: undefined
	Login: undefined
	SelectLanguageScreen: undefined
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const AuthStackScreen: React.FC = () => {
	const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null)

	useEffect(() => {
		const checkOnboarding = async () => {
			try {
				const flag = await AsyncStorage.getItem('hasSeenOnboarding')
				setHasSeenOnboarding(flag === 'true')
			} catch (error) {
				console.error('Error retrieving onboarding flag:', error)
				setHasSeenOnboarding(false)
			}
		}

		checkOnboarding()
	}, [])

	if (hasSeenOnboarding === null) {
		return <LoadingUi />
	}

	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			{!hasSeenOnboarding ? (
				<>
					<AuthStack.Screen
						name='Welcome'
						component={Welcome}
					/>
					<AuthStack.Screen
						name='SelectLanguageScreen'
						component={SelectLanguageScreen}
					/>
					<AuthStack.Screen
						name='SignUp'
						component={SignUp}
					/>
					<AuthStack.Screen
						name='Login'
						component={Login}
					/>
				</>
			) : (
				<>
					<AuthStack.Screen
						name='Login'
						component={Login}
					/>
					<AuthStack.Screen
						name='SignUp'
						component={SignUp}
					/>
				</>
			)}
		</AuthStack.Navigator>
	)
}

export default AuthStackScreen
