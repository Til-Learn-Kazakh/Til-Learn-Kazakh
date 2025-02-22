import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useMutation } from '@tanstack/react-query'
import { Audio } from 'expo-av'

import { imageserver } from '../../../../core/config/environment.config'
import { taskService } from '../../main/services/task.service'
import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'
import WordList from '../../translate-audio/components/wordList/WordList'

import SoundImage from './SoundImage'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	wordsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	wordBox: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#E8E6E8',
		borderRadius: 8,
		margin: 4,
		padding: 8,
		height: 34,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		justifyContent: 'center',
	},
	wordText: {
		fontSize: 18,
	},
})
const MAX_FIRST_LINE = 3 // Пример: сначала 3 слова идут в первую линию

const TapAudio = ({ task, onNext }: any) => {
	const [availableWords, setAvailableWords] = useState<string[]>([])
	const [selectedWords, setSelectedWords] = useState<string[]>([])
	const [actionDone, setActionDone] = useState(false)
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
	const [sound, setSound] = useState<Audio.Sound | null>(null)

	// Мутация для проверки ответа
	const { mutate } = useMutation({
		mutationFn: ({ taskId, userAnswer }: { taskId: string; userAnswer: string }) =>
			taskService.checkAnswer(taskId, userAnswer),
		onSuccess: response => {
			setIsCorrect(response.is_correct)
			if (!response.is_correct) {
				setCorrectAnswer(response.correct_answer)
			}
		},
		onError: error => {
			console.error('❌ Error checking answer:', error)
		},
	})

	// Проигрывание аудио
	const handlePlayAudio = async () => {
		try {
			if (sound) {
				await sound.unloadAsync()
			}
			const { sound: newSound } = await Audio.Sound.createAsync({
				uri: `${imageserver}${task.audio_path}`,
			})
			setSound(newSound)
			await newSound.playAsync()
		} catch (error) {
			console.error('Ошибка при воспроизведении аудио:', error)
		}
	}

	useEffect(() => {
		return sound
			? () => {
					sound.unloadAsync()
				}
			: undefined
	}, [sound])

	// Инициализируем банк слов
	useEffect(() => {
		const cleanedHints = task.hints.map((hint: string) => hint.trim())
		setAvailableWords(cleanedHints)
		setSelectedWords([])
		setActionDone(false)
	}, [task])

	// Нажатие на слово в банке → переносим в итог (верх)
	const selectWord = (word: string) => {
		setAvailableWords(prev => prev.filter(w => w !== word))
		setSelectedWords(prev => {
			const newSel = [...prev, word]
			if (newSel.length > 0) {
				setActionDone(true)
			}
			return newSel
		})
	}

	// Нажатие на слово в итоге (верх) → возвращаем в банк
	const deselectWord = (word: string) => {
		setSelectedWords(prev => {
			const newSel = prev.filter(w => w !== word)
			if (newSel.length === 0) {
				setActionDone(false)
			}
			return newSel
		})
		setAvailableWords(prev => [...prev, word])
	}

	const handleCheck = () => {
		const userAnswer = selectedWords.join(' ')
		mutate({ taskId: task.id, userAnswer })
	}

	const handleContinue = () => {
		const cleanedHints = task.hints.map((hint: string) => hint.trim())
		setAvailableWords(cleanedHints)
		setSelectedWords([])
		setActionDone(false)
		setIsCorrect(null)
		setCorrectAnswer(null)
		onNext()
	}

	const row1 = selectedWords.slice(0, MAX_FIRST_LINE)
	const row2 = selectedWords.slice(MAX_FIRST_LINE)

	const row1View = (
		<View style={styles.wordsContainer}>
			{row1.map((word, i) => (
				<TouchableOpacity
					key={`${word}-${i}`}
					onPress={() => deselectWord(word)}
				>
					<View style={styles.wordBox}>
						<Text style={styles.wordText}>{word}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	)

	// Вторая линия
	const row2View = (
		<View style={styles.wordsContainer}>
			{row2.map((word, i) => (
				<TouchableOpacity
					key={`${word}-${i}`}
					onPress={() => deselectWord(word)}
				>
					<View style={styles.wordBox}>
						<Text style={styles.wordText}>{word}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	)

	const bankView = (
		<View style={styles.wordsContainer}>
			{availableWords.map((word, i) => (
				<TouchableOpacity
					key={`${word}-${i}`}
					onPress={() => selectWord(word)}
				>
					<View style={styles.wordBox}>
						<Text style={styles.wordText}>{word}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	)

	return (
		<View style={styles.container}>
			<Header title={task.question.ru || 'Listen and rearrange the sentence'} />

			<SoundImage onPress={handlePlayAudio} />

			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<WordList
					row1={row1View}
					row2={row2View}
					bank={bankView}
				/>
			</ScrollView>

			<Footer
				isDisabled={!actionDone}
				onPress={handleCheck}
				isSuccess={isCorrect}
				correctAnswer={isCorrect === false ? correctAnswer : undefined}
				onContinue={handleContinue}
			/>
		</View>
	)
}

export default TapAudio
