import React from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationProp, useNavigation } from '@react-navigation/native'

// Цвета
const COLORS = {
	DEFAULT_BLUE: '#007BFF',
	gray2: '#B0B0B0',
}

// Пустые компоненты
const HomeStackScreen: React.FC = () => null
const UserStackScreen: React.FC = () => null
const CartStackScreen: React.FC = () => null

// Кастомная кнопка
type CustomTabBarButtonProps = {
	children: React.ReactNode
	onPress?: () => void
}

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ children, onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
		>
			{children}
		</TouchableOpacity>
	)
}

// Создаём объект для навигации
const Tab = createBottomTabNavigator()

// Общие стили для вкладок
const tabBarStyle: ViewStyle = {
	position: 'absolute',
	bottom: 0,
	right: 0,
	left: 0,
	elevation: 0,
	height: 70,
	borderTopColor: COLORS.gray2,
	borderTopWidth: 1,
}

const screenOptions: BottomTabNavigationOptions = {
	tabBarShowLabel: false,
	tabBarHideOnKeyboard: true,
	headerShown: false,
	tabBarStyle, // Используем типизированный стиль
}

// Основной компонент
const BottomTabNavigation: React.FC = () => {
	const navigation = useNavigation<NavigationProp<any>>() // Навигация

	return (
		<Tab.Navigator screenOptions={screenOptions}>
			<Tab.Screen
				name='HomeStack'
				component={HomeStackScreen}
				options={{
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? 'home' : 'home-outline'}
							size={24}
							color={focused ? COLORS.DEFAULT_BLUE : COLORS.gray2}
						/>
					),
				}}
			/>
			<Tab.Screen
				name='CartStack'
				component={CartStackScreen}
				options={{
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? 'cart' : 'cart-outline'}
							size={24}
							color={focused ? COLORS.DEFAULT_BLUE : COLORS.gray2}
						/>
					),
					tabBarButton: props => (
						<CustomTabBarButton
							{...props}
							onPress={() =>
								navigation.navigate('CartStack', {
									screen: 'cart',
								})
							}
						/>
					),
				}}
			/>
			<Tab.Screen
				name='UserStack'
				component={UserStackScreen}
				options={{
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? 'person' : 'person-outline'}
							size={24}
							color={focused ? COLORS.DEFAULT_BLUE : COLORS.gray2}
						/>
					),
					tabBarButton: props => (
						<CustomTabBarButton
							{...props}
							onPress={() =>
								navigation.navigate('UserStack', {
									screen: 'profile',
								})
							}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	)
}

export default BottomTabNavigation
