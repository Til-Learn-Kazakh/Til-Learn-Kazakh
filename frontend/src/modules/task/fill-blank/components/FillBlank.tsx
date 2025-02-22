import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useMutation } from '@tanstack/react-query'

import { imageserver } from '../../../../core/config/environment.config'
import { taskService } from '../../main/services/task.service'
import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'

import BlankImage from './BlankImage'
import FillBlankMain from './FillBlankMain'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
})

const FillBlank = ({ task, onNext }: any) => {
	const [actionDone, setActionDone] = useState(false) // For enabling/disabling "CHECK"
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
	const [userAnswer, setUserAnswer] = useState('') // The chosen word

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
			console.error('Ошибка при проверке ответа:', error)
		},
	})

	const handleCheck = () => {
		if (!userAnswer) {
			console.log('❌ userAnswer is empty, cannot check')
			return
		}
		mutate({ taskId: task.id, userAnswer })
	}

	const handleContinue = () => {
		setIsCorrect(null)
		setCorrectAnswer(null)
		setActionDone(false)
		setUserAnswer('')
		onNext()
	}

	return (
		<View style={styles.container}>
			<Header title={task?.question?.en || 'Fill in the blank'} />

			<BlankImage image={`${imageserver}${task.image_path}`} />

			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<FillBlankMain
					words={task.hints}
					sentence={task.sentence}
					onComplete={setActionDone} // If user has chosen a word
					onAnswerChange={setUserAnswer} // The single chosen word
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

export default FillBlank
