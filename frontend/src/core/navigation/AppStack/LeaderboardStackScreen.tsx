import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Leaderboard from '../../../modules/leaderboard/components/Leaderboard'

const LeaderboardStack = createNativeStackNavigator()

const LeaderboardStackScreen = () => (
	<LeaderboardStack.Navigator
		screenOptions={{
			headerShown: false, // This will apply to all screens unless overridden
		}}
	>
		<LeaderboardStack.Screen
			name='Leaderboard'
			component={Leaderboard}
		/>
	</LeaderboardStack.Navigator>
)

export default LeaderboardStackScreen
