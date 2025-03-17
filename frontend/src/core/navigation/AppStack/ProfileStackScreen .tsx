import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AnalyticsScreen from '../../../modules/profile/components/AnalyticsScreen'
import InfoAnalyticsPage from '../../../modules/profile/components/InfoAnalyticsPage'
import Profile from '../../../modules/profile/components/Profile'
import Settings from '../../../modules/profile/components/Settings'

const ProfileStack = createNativeStackNavigator()

const ProfileStackScreen = () => (
	<ProfileStack.Navigator
		screenOptions={{
			headerShown: false, // This will apply to all screens unless overridden
		}}
	>
		<ProfileStack.Screen
			name='Profile'
			component={Profile}
		/>
		<ProfileStack.Screen
			name='AnalyticsScreen'
			component={AnalyticsScreen}
		/>
		<ProfileStack.Screen
			name='InfoAnalyticsPage'
			component={InfoAnalyticsPage}
		/>
		<ProfileStack.Screen
			name='Settings'
			component={Settings}
		/>
	</ProfileStack.Navigator>
)

export default ProfileStackScreen
