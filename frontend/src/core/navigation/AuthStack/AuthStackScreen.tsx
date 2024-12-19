import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '../../../modules/auth/components/login/Login'
import SignUp from '../../../modules/auth/components/signup/SignUp'
import Welcome from '../../../modules/welcome/pages/Welcome'

export type AuthStackParamList = {
	Welcome: undefined
	SignUp: undefined
	Login: undefined
}
const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const AuthStackScreen: React.FC = () => (
	<AuthStack.Navigator
		screenOptions={{
			headerShown: false,
		}}
	>
		<AuthStack.Screen
			name='Welcome'
			component={Welcome}
		/>
		<AuthStack.Screen
			name='SignUp'
			component={SignUp}
		/>
		<AuthStack.Screen
			name='Login'
			component={Login}
		/>
		{/* Здесь можно добавить другие экраны авторизации */}
	</AuthStack.Navigator>
)

export default AuthStackScreen
