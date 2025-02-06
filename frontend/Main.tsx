import React, { useRef } from 'react'
import { StatusBar } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createNotifications } from 'react-native-notificated'
import { QueryClient, QueryClientProvider } from 'react-query'

import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { BottomSheetProvider } from './src/core/hooks/BottomSheetProvider'
import BottomTabNavigation from './src/core/navigation/AppStack/BottomTabNavigation'
import AuthStackScreen from './src/core/navigation/AuthStack/AuthStackScreen'
import { LoadingUi } from './src/core/ui/LoadingUi'
import { useCurrentUser } from './src/modules/auth/hooks/user-current-user.hook'

const Stack = createNativeStackNavigator()
const { NotificationsProvider } = createNotifications()
const queryClient = new QueryClient() // Создаем QueryClient здесь

const Main: React.FC = () => {
	const { data: currentUser, isPending } = useCurrentUser()

	const navigationRef = useRef<NavigationContainerRef<{}>>(null)
	if (isPending) {
		return <LoadingUi />
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NotificationsProvider>
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
			</NotificationsProvider>
		</GestureHandlerRootView>
	)
}

export default Main
