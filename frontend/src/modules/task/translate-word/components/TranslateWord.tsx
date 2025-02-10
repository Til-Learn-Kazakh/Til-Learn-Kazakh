import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { icons } from '../../../../core/constants'
import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'

import ImageWithOptions from './ImageWithOptions'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	content: {
		flex: 1,
		padding: 16,
	},
})

const TranslateWord = () => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [actionDone, setActionDone] = useState(false)

	const handleOptionSelect = (option: string) => {
		setSelectedOption(option)
		setActionDone(true) // Activate the footer button
	}

	const handleCheck = () => {
		console.log('Selected Option:', selectedOption)
	}

	// Sample options and image
	const options = ['рыба', 'мясо', 'сыр']
	const imageUri = icons.fish

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header title='Translate "the fish"' />

			{/* Content */}
			<ScrollView contentContainerStyle={styles.content}>
				<ImageWithOptions
					image={imageUri}
					options={options}
					selectedOption={selectedOption}
					onOptionSelect={handleOptionSelect}
				/>
			</ScrollView>

			{/* Footer */}
			<Footer
				isDisabled={!actionDone}
				onPress={handleCheck}
			/>
		</View>
	)
}

export default TranslateWord
