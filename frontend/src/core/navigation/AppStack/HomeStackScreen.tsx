import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../../../modules/home/components/Home'

const HomeStack = createNativeStackNavigator()

const HomeStackScreen = () => (
	<HomeStack.Navigator
		screenOptions={{
			headerShown: false, // This will apply to all screens unless overridden
		}}
	>
		<HomeStack.Screen
			name='Home'
			component={Home}
		/>
	</HomeStack.Navigator>
)

export default HomeStackScreen
