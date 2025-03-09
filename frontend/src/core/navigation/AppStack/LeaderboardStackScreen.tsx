import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LeaderboardScreen from '../../../modules/leaderboard/components/Leaderboard'

const LeaderboardStack = createNativeStackNavigator()

const LeaderboardStackScreen = () => (
	<LeaderboardStack.Navigator
		screenOptions={{
			headerShown: false, // This will apply to all screens unless overridden
		}}
	>
		{/* Главный тестовый экран с кнопками */}
		<LeaderboardStack.Screen
			name='Leaderboard'
			component={LeaderboardScreen}
		/>
	</LeaderboardStack.Navigator>
)

export default LeaderboardStackScreen
