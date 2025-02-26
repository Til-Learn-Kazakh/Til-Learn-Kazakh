import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { useMutation } from '@tanstack/react-query'

import { imageserver } from '../../../../core/config/environment.config'
// Adjust path
import { taskService } from '../../main/services/task.service'
// Adjust the path if needed
import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'

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

const WhichIsTrue = ({ task, onNext }: any) => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [actionDone, setActionDone] = useState(false)
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)

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
			<Header title={task?.question?.en || 'Which of these is correct?'} />

			{/* Content */}
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.cardContainer}>
					{task?.image_options?.map((option: any) => (
						<ImageCard
							key={option.id}
							text={option.text}
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
			/>
		</View>
	)
}

export default WhichIsTrue
