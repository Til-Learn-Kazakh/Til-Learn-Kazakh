import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AchievementModalScreen from '../../../modules/achievements/components/AchievementModalScreen'
import AchievementsScreen from '../../../modules/achievements/components/AchievementsScreen'
import { InfoPage } from '../../../modules/home/components/InfoPage'
import AnalyticsScreen from '../../../modules/profile/components/AnalyticsScreen'
import AvatarPickerPage from '../../../modules/profile/components/AvatarPickerPage'
import InfoAnalyticsPage from '../../../modules/profile/components/InfoAnalyticsPage'
import Profile from '../../../modules/profile/components/Profile'
import ChangeProfile from '../../../modules/settings/components/ChangeProfile'
import LanguagePage from '../../../modules/settings/components/LanguagePage'
import PasswordChange from '../../../modules/settings/components/PasswordChange'
import Settings from '../../../modules/settings/components/Settings'
import SupportScreen from '../../../modules/settings/components/SupportScreen'

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
			name='InfoPage'
			component={InfoPage}
			options={{
				presentation: 'modal',
				gestureDirection: 'vertical',
			}}
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
		<ProfileStack.Screen
			name='ChangeProfile'
			component={ChangeProfile}
		/>
		<ProfileStack.Screen
			name='SupportScreen'
			component={SupportScreen}
		/>
		<ProfileStack.Screen
			name='LanguagePage'
			component={LanguagePage}
		/>
		<ProfileStack.Screen
			name='AvatarPickerPage'
			component={AvatarPickerPage}
		/>

		<ProfileStack.Screen
			name='PasswordChange'
			component={PasswordChange}
		/>

		<ProfileStack.Screen
			name='AchievementsScreen'
			component={AchievementsScreen}
		/>
		<ProfileStack.Screen
			name='AchievementModalScreen'
			component={AchievementModalScreen}
			options={{
				presentation: 'modal', // <- делает экран «модальным»
				headerShown: false, // или можно показать свой header
			}}
		/>
	</ProfileStack.Navigator>
)

export default ProfileStackScreen
