import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CURRENT_USER_QUERY_KEY } from '../../../auth/hooks/user-current-user.hook'
import { taskService } from '../../main/services/task.service'
import Footer from '../../translate-audio/components/footer/Footer'

import QuestionCard from './QuestionCard'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
})

const ReadRespond = ({ task, onNext, hearts, bottomSheetRef, onCorrectAnswer, onMistake }: any) => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [actionDone, setActionDone] = useState(false)
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
	const queryClient = useQueryClient() // Получаем queryClient
	const { i18n } = useTranslation()

	// Backend request for checking the answer
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
			console.error('❌ Error checking answer:', error)
		},
	})

	// Reset state when task changes
	useEffect(() => {
		setSelectedOption(null)
		setActionDone(false)
		setIsCorrect(null)
		setCorrectAnswer(null)
	}, [task])

	// User selects an answer
	const handleOptionSelect = (option: string) => {
		setSelectedOption(option)
		setActionDone(true)
	}

	// User checks the answer
	const handleCheck = () => {
		if (!selectedOption) return
		mutate({ taskId: task.id, userAnswer: selectedOption })
	}

	// Move to next task
	const handleContinue = () => {
		onNext()
	}

	return (
		<View style={styles.container}>
			{/* Header */}

			{/* Content */}
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<QuestionCard
					description={task?.description[i18n.language] || task?.description['en']}
					question={task?.question[i18n.language] || task?.question['en']}
					options={task?.localized_hints?.[i18n.language] || task?.localized_hints?.['en'] || []}
					selectedOption={selectedOption}
					highlightedWord={
						task?.highlighted_word?.[i18n.language] || task?.highlighted_word?.['en']
					}
					onOptionSelect={handleOptionSelect}
				/>
			</ScrollView>

			{/* Footer */}
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

export default ReadRespond
