import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TestTasksPage from '../../../modules/TestTasksPage'
import FillBlank from '../../../modules/task/fill-blank/components/FillBlank'
import ReadRespond from '../../../modules/task/read-respond/components/ReadRespond'
import TapAudio from '../../../modules/task/tap-audio/components/TapAudio'
import TranslateAudio from '../../../modules/task/translate-audio/components/page/TranslateAudio'
import TranslateWord from '../../../modules/task/translate-word/components/TranslateWord'
import WhatYouHear from '../../../modules/task/what-do-you-hear/components/WhatYouHear'
import WhichIsTrue from '../../../modules/task/which-istrue/components/WhichIsTrue'
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

		{/* Страницы заданий */}
		<LeaderboardStack.Screen
			name='TranslateAudio'
			component={TranslateAudio}
		/>
		<LeaderboardStack.Screen
			name='TapAudio'
			component={TapAudio}
		/>
		<LeaderboardStack.Screen
			name='WhatYouHear'
			component={WhatYouHear}
		/>
		<LeaderboardStack.Screen
			name='FillBlank'
			component={FillBlank}
		/>
		<LeaderboardStack.Screen
			name='ReadRespond'
			component={ReadRespond}
		/>
		<LeaderboardStack.Screen
			name='WhichIsTrue'
			component={WhichIsTrue}
		/>
		<LeaderboardStack.Screen
			name='TranslateWord'
			component={TranslateWord}
		/>
	</LeaderboardStack.Navigator>
)

export default LeaderboardStackScreen
