import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface FillBlankMainProps {
	words: string[]
	sentence: string[] // e.g. ["Ұстаз", "__", "тапсырмасын", "тексерді."]
	onComplete: (isComplete: boolean) => void
	onAnswerChange: (answer: string) => void
}

const FillBlankMain: React.FC<FillBlankMainProps> = ({
	words,
	sentence,
	onComplete,
	onAnswerChange,
}) => {
	// If there's only ONE blank, we can just store the single chosen word
	const [chosenWord, setChosenWord] = useState<string | null>(null)

	// The displayed sentence can be built from the original array,
	// replacing the single blank with `chosenWord` if any.
	const displaySentence = sentence.map(part => (part === '__' && chosenWord ? chosenWord : part))

	// Any time `chosenWord` changes, check if user has chosen something
	useEffect(() => {
		// If user has chosen a word, we can say "complete = true"
		const isComplete = chosenWord !== null
		onComplete(isComplete)

		// Pass the single chosen word up to parent
		onAnswerChange(chosenWord || '')
	}, [chosenWord])

	const handleWordPress = (word: string) => {
		// Only allow choosing one word for the blank
		setChosenWord(word)
	}

	const handleRemoveWord = () => {
		setChosenWord(null)
	}

	return (
		<View style={styles.container}>
			{/* Render the sentence with the single blank */}
			<View style={styles.sentenceContainer}>
				{displaySentence.map((part, idx) => {
					if (sentence[idx] === '__') {
						// This is the blank
						return (
							<TouchableOpacity
								key={idx}
								style={styles.blank}
								onPress={handleRemoveWord}
							>
								<Text style={styles.blankText}>{part !== '__' ? part : ''}</Text>
							</TouchableOpacity>
						)
					} else {
						// Normal text
						return (
							<Text
								key={idx}
								style={styles.word}
							>
								{part}
							</Text>
						)
					}
				})}
			</View>

			{/* Render the set of words to choose from */}
			<View style={styles.wordsContainer}>
				{words.map(word => (
					<TouchableOpacity
						key={word}
						style={styles.wordButton}
						onPress={() => handleWordPress(word)}
					>
						<Text style={styles.wordText}>{word}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	)
}

export default FillBlankMain

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		marginTop: 15,
	},
	sentenceContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 32,
	},
	word: {
		fontSize: 20,
		marginHorizontal: 4,
		color: '#333',
	},
	blank: {
		borderBottomWidth: 2,
		borderBottomColor: '#ccc',
		minWidth: 50,
		marginHorizontal: 4,
		alignItems: 'center',
		padding: 4,
	},
	blankText: {
		fontSize: 20,
		color: '#333',
	},
	wordsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 6,
		paddingHorizontal: 10,
	},
	wordButton: {
		backgroundColor: '#fff',
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 13,
		borderWidth: 2,
		borderColor: '#999',
		minWidth: 60,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 4,
	},
	wordText: {
		fontSize: 18,
		color: '#333',
		fontWeight: '500',
		textAlign: 'center',
	},
})
