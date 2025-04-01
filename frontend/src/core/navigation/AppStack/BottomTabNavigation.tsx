import React from 'react'
import { TouchableOpacity } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
	NavigationProp,
	getFocusedRouteNameFromRoute,
	useNavigation,
} from '@react-navigation/native'

import HomeStackScreen from './HomeStackScreen'
import LeaderboardStackScreen from './LeaderboardStackScreen'
import ProfileStackScreen from './ProfileStackScreen '
import { t } from 'i18next'

const COLORS = {
	DUOLINGO_GREEN: '#0286FF',
	GRAY2: '#B0B0B0',
}

type CustomTabBarButtonProps = {
	children: React.ReactNode
	onPress?: () => void
}

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ children, onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{children}
		</TouchableOpacity>
	)
}

const Tab = createBottomTabNavigator()

const screenOptions: BottomTabNavigationOptions = {
	headerShown: false,
	tabBarStyle: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
		elevation: 0,
		height: 85,
		borderTopColor: COLORS.GRAY2,
		borderTopWidth: 1,
		backgroundColor: '#fff',
	},
	tabBarActiveTintColor: COLORS.DUOLINGO_GREEN,
	tabBarInactiveTintColor: COLORS.GRAY2,
	tabBarLabelStyle: {
		fontSize: 12,
		marginBottom: 3,
	},
	tabBarItemStyle: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabBarIconStyle: {
		marginTop: 2,
	},
	tabBarHideOnKeyboard: true,
	tabBarLabelPosition: 'below-icon',
}

const BottomTabNavigation = ({ route }: { route: any }) => {
	const { currentUser } = route.params
	const navigation = useNavigation<NavigationProp<any>>()

	return (
		<Tab.Navigator screenOptions={screenOptions}>
			{/* LESSONS */}
			<Tab.Screen
				name='HomeStack'
				component={HomeStackScreen}
				initialParams={{ currentUser }}
				options={({ route }) => {
					const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home'

					// Проверяем, нужно ли скрыть таббар
					const isTabBarHidden =
						routeName === 'TaskScreen' ||
						routeName === 'LessonCompleteScreen' ||
						routeName === 'StreakTracker'
					// routeName === 'PasswordChange' ||
					// routeName === 'ChangeProfile'

					return {
						// Возвращаем нужные настройки для таб-бара
						tabBarStyle: isTabBarHidden
							? { display: 'none' }
							: {
									position: 'absolute',
									bottom: 0,
									right: 0,
									left: 0,
									elevation: 0,
									height: 85,
									borderTopColor: COLORS.GRAY2,
									borderTopWidth: 1,
									backgroundColor: '#fff',
								},

						tabBarLabel: t('LESSONS'),
						tabBarIcon: ({ color, size }) => (
							<Ionicons
								name='book-outline'
								size={size}
								color={color}
							/>
						),
						tabBarButton: props => (
							<CustomTabBarButton
								{...props}
								onPress={() => {
									navigation.navigate('AppStack', {
										screen: 'HomeStack',
										params: {
											screen: 'Home',
										},
									})
								}}
							/>
						),
					}
				}}
			/>

			{/* LEADERBOARD */}
			<Tab.Screen
				name='LeaderboardStack'
				component={LeaderboardStackScreen}
				options={{
					tabBarLabel: t('LEADERBOARD.HEADER_TITLE'),
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='trophy-outline'
							size={size}
							color={color}
						/>
					),
					tabBarButton: props => (
						<CustomTabBarButton
							{...props}
							onPress={() => {
								navigation.navigate('AppStack', {
									screen: 'LeaderboardStack',
									params: {
										screen: 'Leaderboard',
									},
								})
							}}
						/>
					),
				}}
			/>
			{/* PROFILE */}
			<Tab.Screen
				name='ProfileStack'
				component={ProfileStackScreen}
				options={({ route }) => {
					const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile'

					// Проверяем, нужно ли скрыть таббар
					const isTabBarHidden =
						routeName === 'PasswordChange' ||
						routeName === 'ChangeProfile' ||
						routeName === 'AvatarPickerPage'

					return {
						// Возвращаем нужные настройки для таб-бара
						tabBarStyle: isTabBarHidden
							? { display: 'none' }
							: {
									position: 'absolute',
									bottom: 0,
									right: 0,
									left: 0,
									elevation: 0,
									height: 85,
									borderTopColor: COLORS.GRAY2,
									borderTopWidth: 1,
									backgroundColor: '#fff',
								},

						tabBarLabel: t('PROFILE.HEADER_TITLE'),
						tabBarIcon: ({ color, size }) => (
							<Ionicons
								name='person-outline'
								size={size}
								color={color}
							/>
						),
						tabBarButton: props => (
							<CustomTabBarButton
								{...props}
								onPress={() => {
									navigation.navigate('AppStack', {
										screen: 'ProfileStack',
										params: {
											screen: 'Profile',
										},
									})
								}}
							/>
						),
					}
				}}
			/>
		</Tab.Navigator>
	)
}

export default BottomTabNavigation
