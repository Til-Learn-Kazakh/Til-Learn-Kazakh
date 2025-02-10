import React from 'react'
import { Button, StyleSheet, View } from 'react-native'

import { NavigationProp, useNavigation } from '@react-navigation/native'

const TestTasksPage = () => {
	const navigation = useNavigation<NavigationProp<any>>()

	return (
		<View style={styles.container}>
			<Button
				title='Translate this sentence'
				onPress={() => navigation.navigate('TranslateAudio')}
			/>
			<Button
				title='Tap what you hear'
				onPress={() => navigation.navigate('TapAudio')}
			/>
			<Button
				title='What do you hear'
				onPress={() => navigation.navigate('WhatYouHear')}
			/>
			<Button
				title='Fill in the blank'
				onPress={() => navigation.navigate('FillBlank')}
			/>
			<Button
				title='Read and Respond'
				onPress={() => navigation.navigate('ReadRespond')}
			/>
			<Button
				title='Which of these'
				onPress={() => navigation.navigate('WhichIsTrue')}
			/>
			<Button
				title='Translate the Word'
				onPress={() => navigation.navigate('TranslateWord')}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 20, // Пространство между кнопками
		backgroundColor: 'white',
	},
})

export default TestTasksPage
