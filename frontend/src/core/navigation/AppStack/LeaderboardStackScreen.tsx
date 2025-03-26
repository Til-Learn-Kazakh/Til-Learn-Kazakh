import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import InfoLeaderboardPage from '../../../modules/leaderboard/components/InfoLeaderboardPage'
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
		<LeaderboardStack.Screen
			name='InfoLeaderboardPage'
			component={InfoLeaderboardPage}
		/>
	</LeaderboardStack.Navigator>
)

export default LeaderboardStackScreen
