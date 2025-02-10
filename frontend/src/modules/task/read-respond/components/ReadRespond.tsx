import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'

import QuestionCard from './QuestionCard'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
})

const ReadRespond = () => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [actionDone, setActionDone] = useState(false)

	const handleOptionSelect = (option: string) => {
		setSelectedOption(option)
		setActionDone(true) // Activate the footer button
	}

	const handleCheck = () => {
		console.log('Selected Option:', selectedOption)
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header title='Read and Respond' />

			{/* Content */}
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<QuestionCard
					description='I bought tickets for a flight that lands at 10 a.m. because I prefer an early arrival.'
					question="What does 'arrival' mean?"
					options={['leaving a place', 'getting to a place', 'staying at a place']}
					selectedOption={selectedOption}
					highlightedWord='arrival'
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

export default ReadRespond
