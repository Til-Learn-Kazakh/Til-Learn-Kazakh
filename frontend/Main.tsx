import React, { useRef, useState } from 'react'
import { StatusBar } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createNotifications } from 'react-native-notificated'
import { QueryClient, QueryClientProvider } from 'react-query'

import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BottomTabNavigation from './src/core/navigation/AppStack/BottomTabNavigation'
import AuthStackScreen from './src/core/navigation/AuthStack/AuthStackScreen'

const Stack = createNativeStackNavigator()
const { NotificationsProvider } = createNotifications()
const queryClient = new QueryClient() // Создаем QueryClient здесь

const Main: React.FC = () => {
	const [isAuthenticated] = useState(true) // Управление авторизацией

	const navigationRef = useRef<NavigationContainerRef<{}>>(null)

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NotificationsProvider>
				<QueryClientProvider client={queryClient}>
					<NavigationContainer ref={navigationRef}>
						<StatusBar
							barStyle='dark-content'
							backgroundColor='#fff'
						/>
						<Stack.Navigator
							screenOptions={{
								headerShown: false,
							}}
						>
							{isAuthenticated ? (
								<Stack.Group>
									<Stack.Screen
										name='AppStack'
										component={BottomTabNavigation}
										options={{ headerShown: false }}
									/>
								</Stack.Group>
							) : (
								<Stack.Group>
									<Stack.Screen
										name='AuthStack'
										component={AuthStackScreen}
										options={{ headerShown: false }}
									/>
								</Stack.Group>
							)}

							{/* <Stack.Group>
						<Stack.Screen
							name='Bottom Navigation'
							component={BottomTabNavigation}
							options={{ headerShown: false }}
						/>
					</Stack.Group> */}
						</Stack.Navigator>
						{/* <Toast position='top' /> */}
					</NavigationContainer>
				</QueryClientProvider>
			</NotificationsProvider>
		</GestureHandlerRootView>
	)
}

export default Main
