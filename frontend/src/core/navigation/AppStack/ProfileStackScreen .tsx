import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Profile from '../../../modules/profile/components/Profile'

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
	</ProfileStack.Navigator>
)

export default ProfileStackScreen
