import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { imageserver } from '../../../../core/config/environment.config'
import { CURRENT_USER_QUERY_KEY } from '../../../auth/hooks/user-current-user.hook'
import { taskService } from '../../main/services/task.service'
import Footer from '../../translate-audio/components/footer/Footer'

import BlankImage from './BlankImage'
import FillBlankMain from './FillBlankMain'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
})

const FillBlank = ({ task, onNext, hearts, bottomSheetRef, onCorrectAnswer, onMistake }: any) => {
	const [actionDone, setActionDone] = useState(false) // For enabling/disabling "CHECK"
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
	const [userAnswer, setUserAnswer] = useState('') // The chosen word
	const queryClient = useQueryClient() // Получаем queryClient

	const { mutate } = useMutation({
		mutationFn: ({ taskId, userAnswer }: { taskId: string; userAnswer: string }) =>
			taskService.checkAnswer(taskId, userAnswer),

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
			console.error('Ошибка при проверке ответа:', error)
		},
	})

	const handleCheck = () => {
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
				hearts={hearts}
				bottomSheetRef={bottomSheetRef}
			/>
		</View>
	)
}

export default FillBlank
