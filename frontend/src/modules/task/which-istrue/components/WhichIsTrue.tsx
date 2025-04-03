import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { imageserver } from '../../../../core/config/environment.config'
import { CURRENT_USER_QUERY_KEY } from '../../../auth/hooks/user-current-user.hook'
// Adjust path
import { taskService } from '../../main/services/task.service'
// Adjust the path if needed
import Footer from '../../translate-audio/components/footer/Footer'

import ImageCard from './ImageCard'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	content: {
		flex: 1,
		padding: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		marginTop: 35,
	},
})

const WhichIsTrue = ({ task, onNext, hearts, bottomSheetRef, onCorrectAnswer, onMistake }: any) => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [actionDone, setActionDone] = useState(false)
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
	const queryClient = useQueryClient() // Получаем queryClient
	const { i18n } = useTranslation()
	// Backend request to check the answer
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

	const handleOptionSelect = (optionId: string) => {
		setSelectedOption(optionId)
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
			{/* Header */}

			{/* Content */}
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.cardContainer}>
					{task?.image_options?.map((option: any) => (
						<ImageCard
							key={option.id}
							text={option.text?.[i18n.language] || option.text?.['en']}
							image={{ uri: `${imageserver}${option.image}` }}
							isSelected={selectedOption === option.id}
							onPress={() => handleOptionSelect(option.id)}
						/>
					))}
				</View>
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

export default WhichIsTrue
