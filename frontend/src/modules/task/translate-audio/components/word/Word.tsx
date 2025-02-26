import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'

import { WORD_HEIGHT } from './Layout'

const styles = StyleSheet.create({
	root: {
		padding: 4,
	},
	container: {
		padding: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E8E6E8',
		backgroundColor: 'white',
		height: WORD_HEIGHT - 8,
	},
	text: {
		fontFamily: 'Nunito-Regular',
		fontSize: 19,
	},
	shadow: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 8,
		borderBottomWidth: 3,
		borderColor: '#E8E6E8',
		top: 4,
	},
})

interface WordProps {
	word: string
	isSelected?: boolean // Added optional isSelected prop
	onPress?: () => void // Added optional onPress prop
}

const Word = ({ word, onPress }: WordProps) => (
	<View style={styles.root}>
		<TouchableOpacity onPress={onPress}>
			<View style={styles.container}>
				<Text style={styles.text}>{word}</Text>
			</View>
			<View style={styles.shadow} />
		</TouchableOpacity>
	</View>
)

export default Word
