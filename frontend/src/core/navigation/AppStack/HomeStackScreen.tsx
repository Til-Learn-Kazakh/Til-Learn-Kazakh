import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../../../modules/home/components/Home'
import { InfoPage } from '../../../modules/home/components/InfoPage'
import TaskScreen from '../../../modules/task/main/components/TaskScreen'

const HomeStack = createNativeStackNavigator()

const HomeStackScreen = ({ route, navigation }: { route: any; navigation: any }) => {
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
					presentation: 'modal',
					gestureDirection: 'vertical',
				}}
			/>
			<HomeStack.Screen
				name='TaskScreen'
				component={TaskScreen}
			/>
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
