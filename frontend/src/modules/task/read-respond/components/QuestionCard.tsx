import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface QuestionCardProps {
	description: string
	question: string
	options: string[]
	onOptionSelect: (selectedOption: string) => void
	selectedOption: string | null
	highlightedWord?: string
}

const QuestionCard = ({
	description,
	question,
	options,
	onOptionSelect,
	selectedOption,
	highlightedWord = '',
}: QuestionCardProps) => {
	return (
		<View style={styles.card}>
			<Text style={styles.description}>
				{description.split(' ').map((word, index, array) => {
					const cleanWord = word.replace(/[.,!?]/g, '')

					return (
						<React.Fragment key={index}>
							<Text
								style={
									cleanWord.toLowerCase() === highlightedWord.toLowerCase()
										? styles.highlightedWord
										: styles.underlinedWord
								}
							>
								{word}
							</Text>
							{index < array.length - 1 && ' '}
						</React.Fragment>
					)
				})}
			</Text>

			<Text style={styles.question}>{question}</Text>

			{options.map((option, index) => (
				<TouchableOpacity
					key={index}
					style={[styles.option, selectedOption === option && styles.selectedOption]}
					onPress={() => onOptionSelect(option)}
				>
					<Text style={[styles.optionText, selectedOption === option && styles.selectedOptionText]}>
						{option}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	)
}

export default QuestionCard

const styles = StyleSheet.create({
	card: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		marginHorizontal: 5,
		marginTop: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 4,
		elevation: 2,
	},
	description: {
		fontSize: 21,
		color: '#333',
		lineHeight: 38,
		marginBottom: 40,
		flexWrap: 'wrap',
	},
	underlinedWord: {
		textDecorationLine: 'underline',
	},
	highlightedWord: {
		textDecorationLine: 'underline',
		color: '#FF00FF',
		fontWeight: 'bold',
	},
	question: {
		fontSize: 22,
		color: '#333',
		fontWeight: 'bold',
		marginBottom: 30,
		textAlign: 'left',
	},
	option: {
		backgroundColor: '#f0f0f0',
		borderRadius: 16,
		paddingVertical: 20,
		marginBottom: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	optionText: {
		fontSize: 22,
		color: '#333',
		textAlign: 'center',
	},
	selectedOption: {
		backgroundColor: '#007BFF',
	},
	selectedOptionText: {
		color: 'white',
		fontWeight: 'bold',
	},
})
