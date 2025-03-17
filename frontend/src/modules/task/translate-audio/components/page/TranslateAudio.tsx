import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Audio } from 'expo-av'

import { imageserver } from '../../../../../core/config/environment.config'
import { CURRENT_USER_QUERY_KEY } from '../../../../auth/hooks/user-current-user.hook'
import { taskService } from '../../../main/services/task.service'
import Footer from '../footer/Footer'
import WordList from '../wordList/WordList'

import Character from './Character'

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

const TranslateAudio = ({
	task,
	onNext,
	hearts,
	bottomSheetRef,
	onCorrectAnswer,
	onMistake,
}: any) => {
	const [availableWords, setAvailableWords] = useState<string[]>([])
	const [selectedWords, setSelectedWords] = useState<string[]>([])
	const [actionDone, setActionDone] = useState(false)
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
	const [sound, setSound] = useState<Audio.Sound | null>(null)
	const queryClient = useQueryClient() // Получаем queryClient

	// Мутация
	const { mutate } = useMutation({
		mutationFn: ({
			taskId,
			userAnswer,
			userLang,
		}: {
			taskId: string
			userAnswer: string
			userLang?: string
		}) => taskService.checkAnswer(taskId, userAnswer, userLang),
		onSuccess: response => {
			setIsCorrect(response.is_correct)
			if (!response.is_correct) {
				setCorrectAnswer(response.correct_answer)
				onMistake()
			} else {
				onCorrectAnswer()
			}
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
		},
		onError: error => {
			console.error('❌ Error checking answer:', error)
		},
	})

	// Аудио
	const handlePlayAudio = async () => {
		try {
			await Audio.setAudioModeAsync({
				playsInSilentModeIOS: true, // Позволяет играть звук в режиме "без звука"
				allowsRecordingIOS: false,
				staysActiveInBackground: false,
				shouldDuckAndroid: true,
				playThroughEarpieceAndroid: false,
			})
			if (sound) await sound.unloadAsync()
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

	const userLang = 'ru'
	const localizedHints = task.localized_hints?.[userLang] || []
	const cleanedHints = localizedHints.map((h: string) => h.trim())

	useEffect(() => {
		setAvailableWords(cleanedHints)
		setSelectedWords([])
		setActionDone(false)
	}, [task])

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
		mutate({ taskId: task.id, userAnswer, userLang })
	}

	const handleContinue = () => {
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

	// Банк слов (снизу)
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
			<Character onPress={handlePlayAudio} />

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
				hearts={hearts}
				bottomSheetRef={bottomSheetRef}
			/>
		</View>
	)
}

export default TranslateAudio
