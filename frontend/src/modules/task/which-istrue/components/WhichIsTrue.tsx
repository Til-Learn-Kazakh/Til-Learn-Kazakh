import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { icons } from '../../../../core/constants'
import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'

import ImageCard from './ImageCard'

// Import the new ImageCard component

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	content: {
		flex: 1,
		padding: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		marginTop: 35,
	},
})

const WhichIsTrue = () => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [actionDone, setActionDone] = useState(false)

	const handleOptionSelect = (option: string) => {
		setSelectedOption(option)
		setActionDone(true) // Activate the footer button
	}

	const handleCheck = () => {
		console.log('Selected Option:', selectedOption)
	}

	const options = [
		{
			id: '1',
			text: 'Құлпынай',
			image: icons.strawberry,
		},
		{
			id: '2',
			text: 'ет',
			image: icons.bbq,
		},
		{
			id: '3',
			text: 'лимон',
			image: icons.lemon,
		},
		{
			id: '4',
			text: 'ірімшік',
			image: icons.cheese,
		},
	]

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header title='Which of these is "the cheese"?' />

			{/* Content */}
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.cardContainer}>
					{options.map(option => (
						<ImageCard
							key={option.id}
							text={option.text}
							image={option.image}
							isSelected={selectedOption === option.text}
							onPress={() => handleOptionSelect(option.text)}
						/>
					))}
				</View>
			</ScrollView>

			{/* Footer */}
			<Footer
				isDisabled={!actionDone}
				onPress={handleCheck}
			/>
		</View>
	)
}

export default WhichIsTrue
