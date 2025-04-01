import React, { useEffect, useRef, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { StatusBar } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createNotifications } from 'react-native-notificated'
import { QueryClient, QueryClientProvider } from 'react-query'

import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SecureStore from 'expo-secure-store'

import { BottomSheetProvider } from './src/core/hooks/BottomSheetProvider'
import i18n, { initI18n } from './src/core/i18n'
import BottomTabNavigation from './src/core/navigation/AppStack/BottomTabNavigation'
import AuthStackScreen from './src/core/navigation/AuthStack/AuthStackScreen'
import { LoadingUi } from './src/core/ui/LoadingUi'
import { fetchAndSetCSRFToken } from './src/middleware/fetchCSRF'
import { useCurrentUser } from './src/modules/auth/hooks/user-current-user.hook'
import { PreferencesProvider } from './src/modules/settings/hooks/preferences.context'

const Stack = createNativeStackNavigator()
const { NotificationsProvider } = createNotifications()
const queryClient = new QueryClient() // Создаем QueryClient здесь

const Main: React.FC = () => {
	const { data: currentUser, isPending } = useCurrentUser()
	const [isI18nReady, setIsI18nReady] = useState(false)
	useEffect(() => {
		const init = async () => {
			await initI18n()
			setIsI18nReady(true)
		}
		init()
	}, [])

	useEffect(() => {
		const loadCSRF = async () => {
			const token = await SecureStore.getItemAsync('csrf_token')
			if (!token) {
				await fetchAndSetCSRFToken()
			}
		}
		loadCSRF()
	}, [])

	const navigationRef = useRef<NavigationContainerRef<{}>>(null)
	if (isPending) {
		return <LoadingUi />
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<I18nextProvider i18n={i18n}>
				<NotificationsProvider>
					<PreferencesProvider>
						<QueryClientProvider client={queryClient}>
							<NavigationContainer ref={navigationRef}>
								<StatusBar
									barStyle='dark-content'
									backgroundColor='#fff'
								/>
								<BottomSheetProvider>
									<Stack.Navigator
										screenOptions={{
											headerShown: false,
										}}
									>
										{currentUser ? (
											<Stack.Screen
												name='AppStack'
												component={BottomTabNavigation}
												options={{ headerShown: false }}
												initialParams={{ currentUser }}
											/>
										) : (
											// Если пользователя нет, показываем AuthStack
											<Stack.Screen
												name='AuthStack'
												component={AuthStackScreen}
												options={{ headerShown: false }}
											/>
										)}
									</Stack.Navigator>
								</BottomSheetProvider>

								{/* <Toast position='top' /> */}
							</NavigationContainer>
						</QueryClientProvider>
					</PreferencesProvider>
				</NotificationsProvider>
			</I18nextProvider>
		</GestureHandlerRootView>
	)
}

export default Main
