import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

interface FillBlankMainProps {
	words: string[]
	sentence: string[]
	onComplete: (isComplete: boolean) => void
}

const FillBlankMain = ({ words, sentence, onComplete }: any) => {
	const [filledSentence, setFilledSentence] = useState<(any | null)[]>(
		Array(sentence.length).fill(null)
	)

	// Проверяем, все ли пропуски заполнены, после каждого изменения
	useEffect(() => {
		console.log('>>> filledSentence changed:', filledSentence)
		const allFilled = sentence.every((part, i) => part !== '__' || filledSentence[i] !== null)
		console.log('>>> allFilled =', allFilled)
		onComplete(allFilled)
	}, [filledSentence, sentence, onComplete])

	// Клик по слову: вставляем сразу в первый пропуск "__", который ещё пуст (null)
	const handleWordPress = (word: string) => {
		console.log('>>> handleWordPress clicked word:', word)

		// Находим индекс первого пропуска "__", который не заполнен
		const blankIndex = sentence.findIndex((part, i) => part === '__' && filledSentence[i] === null)

		console.log('>>> handleWordPress blankIndex:', blankIndex)
		if (blankIndex === -1) {
			console.log('>>> No free blanks left, ignoring')
			return
		}

		setFilledSentence(prev => {
			const updated = [...prev]
			updated[blankIndex] = word
			console.log('>>> Updating blank index', blankIndex, 'with word:', word)
			return updated
		})
	}

	// Клик по пропуску: удаляем слово в этом индексе
	const handleRemoveWord = (index: number) => {
		console.log('>>> handleRemoveWord at index:', index)
		setFilledSentence(prev => {
			const updated = [...prev]
			updated[index] = null
			return updated
		})
	}

	return (
		<View style={styles.container}>
			{/* Предложение с пропусками */}
			<View style={styles.sentenceContainer}>
				{sentence.map((text, idx) => {
					if (text === '__') {
						return (
							<TouchableOpacity
								key={idx}
								style={styles.blank}
								onPress={() => handleRemoveWord(idx)}
							>
								<Text style={styles.blankText}>{filledSentence[idx] || ''}</Text>
							</TouchableOpacity>
						)
					}
					return (
						<Text
							key={idx}
							style={styles.word}
						>
							{text}
						</Text>
					)
				})}
			</View>

			{/* Набор слов для вставки */}
			<View style={styles.wordsContainer}>
				{words.map((word: any) => (
					<TouchableOpacity
						key={word}
						style={styles.wordButton}
						onPress={() => handleWordPress(word)}
					>
						<LinearGradient
							colors={['#4facfe', '#00f2fe']} // Gradient colors (warm orange-pink tones)
							style={styles.wordButton}
						>
							<View style={styles.wordContent}>
								<Text style={styles.wordText}>{word}</Text>
							</View>
						</LinearGradient>
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
		justifyContent: 'center', // Center words in the container
		gap: 6, // Reduce spacing between words for a more compact look
		paddingHorizontal: 10, // Add horizontal padding for better alignment
	},
	wordButton: {
		paddingVertical: 10, // Reduce vertical padding
		paddingHorizontal: 16, // Reduce horizontal padding
		borderRadius: 8, // Slightly smaller rounded edges
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 }, // Softer shadow
		shadowOpacity: 0.12,
		shadowRadius: 4,
		elevation: 3,
		minWidth: 70, // Ensure buttons maintain a structured look
		alignItems: 'center',
		justifyContent: 'center',
	},
	wordText: {
		fontSize: 18, // Reduce text size slightly
		color: '#fff',
		fontWeight: '600', // Adjust font weight for better readability
		textAlign: 'center',
	},
	wordContent: {
		justifyContent: 'center',
		alignItems: 'center',
	},
})
