import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../../../modules/home/components/Home'
import { InfoPage } from '../../../modules/home/components/InfoPage'

const HomeStack = createNativeStackNavigator()

const HomeStackScreen = ({ route }: { route: any }) => {
	const { currentUser } = route.params

	return (
		<HomeStack.Navigator
			screenOptions={{
				headerShown: false, // This will apply to all screens unless overridden
			}}
		>
			<HomeStack.Screen
				name='Home'
				component={Home}
				initialParams={{ currentUser }}
			/>
			<HomeStack.Screen
				name='InfoPage'
				component={InfoPage}
				options={{
					gestureDirection: 'vertical', 
				}}
			/>
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
