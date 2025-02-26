import React, { useEffect } from 'react'
import { StyleSheet, Text, Vibration, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AVPlaybackSource, Audio } from 'expo-av'

interface FooterProps {
	isDisabled: boolean
	onPress: () => void
	isSuccess?: boolean | null
	correctAnswer?: any // Добавлен правильный ответ
	onContinue?: () => void // Добавлен обработчик нажатия "CONTINUE"
}

const Footer = ({ isDisabled, onPress, isSuccess, correctAnswer, onContinue }: FooterProps) => {
	const insets = useSafeAreaInsets()

	// Определяем стили в зависимости от правильности ответа
	let feedbackMessage = ''
	let feedbackColor = '#333' // Цвет текста фидбэка
	let backgroundColor = 'transparent' // По умолчанию скрыто
	let buttonColor = '#0286FF' // Стандартный синий
	let soundFile: AVPlaybackSource | null = null

	if (isSuccess === true) {
		feedbackMessage = '✔ Great job!'
		feedbackColor = '#61e002' // Зеленый для правильного ответа
		backgroundColor = '#d4fcbc'
		buttonColor = '#61e002'
		soundFile = require('../../../../../../public/sound/correct.wav')
	} else if (isSuccess === false) {
		feedbackMessage = 'Correct solution:'
		feedbackColor = '#ff4b4b' // Красный для ошибки
		backgroundColor = '#ffdfe0'
		buttonColor = '#ff4b4b'
		soundFile = require('../../../../../../public/sound/wrong.mp3')
	}

	useEffect(() => {
		const playSound = async () => {
			if (isSuccess !== null && soundFile) {
				const { sound } = await Audio.Sound.createAsync(soundFile)
				await sound.playAsync()
			}
		}

		if (isSuccess === true) {
			Vibration.vibrate(200) // Легкая вибрация при правильном ответе
		} else if (isSuccess === false) {
			Vibration.vibrate(500) // Длинная вибрация при ошибке
		}

		playSound()
	}, [isSuccess])

	return (
		<View style={{ paddingBottom: insets.bottom, alignItems: 'center' }}>
			{/* Если ответ еще не проверен, показываем кнопку CHECK */}
			{isSuccess === null ? (
				<RectButton
					style={[styles.checkButton, { backgroundColor: isDisabled ? '#B0BEC5' : '#0286FF' }]}
					enabled={!isDisabled}
					onPress={isDisabled ? undefined : onPress}
				>
					<Text style={styles.buttonLabel}>CHECK</Text>
				</RectButton>
			) : (
				// После проверки показываем блок с фидбэком
				<View style={[styles.footerContainer, { backgroundColor }]}>
					{/* Сообщение Great job! или Correct solution: */}
					<Text style={[styles.feedbackText, { color: feedbackColor }]}>{feedbackMessage}</Text>

					{/* Если ответ был неверным, показываем правильное решение */}
					{isSuccess === false && correctAnswer && (
						<Text style={styles.correctAnswer}>{correctAnswer}</Text>
					)}
					<RectButton
						style={[styles.button, { backgroundColor: buttonColor }]}
						onPress={onContinue} // Теперь нажимаем "CONTINUE", чтобы перейти к следующему заданию
					>
						<Text style={styles.buttonLabel}>CONTINUE</Text>
					</RectButton>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	footerContainer: {
		width: '100%',
		padding: 16,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		alignItems: 'flex-start', // Выровняли контент влево
	},
	feedbackText: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 5,
		textAlign: 'left', // Текст слева
		alignSelf: 'flex-start', // Текст выравнен влево
		marginLeft: 10,
	},
	correctAnswer: {
		fontSize: 17, // Сделал чуть меньше
		fontWeight: 'bold',
		color: '#ff4b4b', // Красный цвет
		marginBottom: 15,
		textAlign: 'left',
		alignSelf: 'flex-start',
		marginLeft: 12,
	},
	button: {
		width: '100%',
		height: 50,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 30,
	},
	buttonLabel: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center',
		fontFamily: 'Nunito-Bold',
	},
	checkButton: {
		width: '92%',
		height: 50,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 19,
	},
})

export default Footer
