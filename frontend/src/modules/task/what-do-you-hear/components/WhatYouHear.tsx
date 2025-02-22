import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useMutation } from '@tanstack/react-query'
import { Audio } from 'expo-av'

import { imageserver } from '../../../../core/config/environment.config'
import { taskService } from '../../main/services/task.service'
import SoundImage from '../../tap-audio/components/SoundImage'
import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'

import OptionGrid from './OptionGrid'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
})

const WhatYouHear = ({ task, onNext }: any) => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [actionDone, setActionDone] = useState(false)
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
	const [sound, setSound] = useState<Audio.Sound | null>(null)

	// Backend request to check the answer
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

	// Play audio function
	const handlePlayAudio = async () => {
		try {
			if (sound) {
				await sound.unloadAsync()
			}

			const { sound: newSound } = await Audio.Sound.createAsync({
				uri: `${imageserver}${task.audio_path}`, // ✅ Use full URL
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

	const handleOptionSelect = (option: string) => {
		setSelectedOption(option)
		setActionDone(true)
	}

	const handleCheck = () => {
		if (selectedOption) {
			mutate({ taskId: task.id, userAnswer: selectedOption })
		}
	}

	const handleContinue = () => {
		setSelectedOption(null)
		setActionDone(false)
		setIsCorrect(null)
		setCorrectAnswer(null)
		onNext()
	}

	return (
		<View style={styles.container}>
			<Header title={task.question.ru} />

			{/* Play audio on image press */}
			<SoundImage onPress={handlePlayAudio} />

			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<OptionGrid
					options={task?.hints || []} // Pass empty array if task.hints is undefined
					onOptionPress={handleOptionSelect}
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

export default WhatYouHear
