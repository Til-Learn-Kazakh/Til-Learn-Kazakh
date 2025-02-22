import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useMutation } from '@tanstack/react-query'

import { imageserver } from '../../../../core/config/environment.config'
import { taskService } from '../../main/services/task.service'
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

const TranslateWord = ({ task, onNext }: any) => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [actionDone, setActionDone] = useState(false) // For disabling CHECK
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)

	// Whenever user picks an option
	const handleOptionSelect = (option: string) => {
		setSelectedOption(option)
		setActionDone(true) // Enable "CHECK"
	}

	// React Query mutation for checkAnswer
	const { mutate } = useMutation({
		mutationFn: ({ taskId, userAnswer }: { taskId: string; userAnswer: string }) =>
			taskService.checkAnswer(taskId, userAnswer),
		onSuccess: response => {
			setIsCorrect(response.is_correct)
			if (!response.is_correct) {
				setCorrectAnswer(response.correct_answer)
			}
		},
		onError: err => {
			console.error('Check answer error:', err)
		},
	})

	const handleCheck = () => {
		if (!selectedOption) return
		mutate({ taskId: task.id, userAnswer: selectedOption })
	}

	const handleContinue = () => {
		// Reset local state
		setSelectedOption(null)
		setActionDone(false)
		setIsCorrect(null)
		setCorrectAnswer(null)

		// Move to next task
		onNext()
	}

	return (
		<View style={styles.container}>
			<Header title={task?.question?.en || 'Translate the word'} />

			<ScrollView contentContainerStyle={styles.content}>
				<ImageWithOptions
					image={`${imageserver}${task.image_path}`}
					options={task.hints}
					selectedOption={selectedOption}
					onOptionSelect={handleOptionSelect}
					isDisabled={isCorrect !== null} // block selection after check
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

export default TranslateWord
