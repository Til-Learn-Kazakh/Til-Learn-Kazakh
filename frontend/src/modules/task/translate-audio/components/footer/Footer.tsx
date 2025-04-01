import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, Vibration, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { AVPlaybackSource, Audio } from 'expo-av'

import { usePreferences } from '../../../../settings/hooks/preferences.context'

interface FooterProps {
	isDisabled: boolean
	onPress: () => void
	isSuccess?: boolean | null
	correctAnswer?: any
	onContinue?: () => void
	hearts: number
	bottomSheetRef: React.RefObject<BottomSheetModal>
}

const Footer = ({
	isDisabled,
	onPress,
	isSuccess,
	correctAnswer,
	onContinue,
	hearts,
	bottomSheetRef,
}: FooterProps) => {
	const insets = useSafeAreaInsets()
	const { preferences } = usePreferences()
	const { t } = useTranslation()

	// Define styling values based on feedback status
	let feedbackColor = '#333'
	let backgroundColor = 'transparent'
	let buttonColor = '#0286FF'
	let soundFile: AVPlaybackSource | null = null

	if (isSuccess === true) {
		feedbackColor = '#61e002'
		backgroundColor = '#d4fcbc'
		buttonColor = '#61e002'
		soundFile = require('../../../../../../public/sound/correct.wav')
	} else if (isSuccess === false) {
		feedbackColor = '#ff4b4b'
		backgroundColor = '#ffdfe0'
		buttonColor = '#ff4b4b'
		soundFile = require('../../../../../../public/sound/wrong.mp3')
	}

	useEffect(() => {
		const playSound = async () => {
			if (isSuccess !== null && soundFile && preferences.soundEffects) {
				const { sound } = await Audio.Sound.createAsync(soundFile)
				await sound.playAsync()
			}
		}

		if (isSuccess === true && preferences.vibration) {
			Vibration.vibrate(200)
		} else if (isSuccess === false && preferences.vibration) {
			Vibration.vibrate(500)
		}

		playSound()
	}, [isSuccess, preferences, soundFile])

	const handleCheckPress = () => {
		if (hearts === 0) {
			bottomSheetRef.current?.present()
		} else {
			onPress()
		}
	}

	const handleContinuePress = () => {
		if (hearts === 0) {
			bottomSheetRef.current?.present()
		} else {
			onContinue?.()
		}
	}

	return (
		<View style={{ paddingBottom: insets.bottom, alignItems: 'center' }}>
			{isSuccess === null ? (
				<RectButton
					style={[styles.checkButton, { backgroundColor: isDisabled ? '#B0BEC5' : '#0286FF' }]}
					enabled={!isDisabled}
					onPress={isDisabled ? undefined : handleCheckPress}
				>
					<Text style={styles.buttonLabel}>{t('TASK.FOOTER.CHECK')}</Text>
				</RectButton>
			) : (
				<View style={[styles.footerContainer, { backgroundColor }]}>
					{/* Feedback message */}
					<Text style={[styles.feedbackText, { color: feedbackColor }]}>
						{isSuccess ? t('TASK.FOOTER.SUCCESS_FEEDBACK') : t('TASK.FOOTER.FAILURE_FEEDBACK')}
					</Text>
					{/* Display correct answer if the answer was wrong */}
					{isSuccess === false && correctAnswer && (
						<Text style={styles.correctAnswer}>{correctAnswer}</Text>
					)}
					<RectButton
						style={[styles.button, { backgroundColor: buttonColor }]}
						onPress={handleContinuePress}
					>
						<Text style={styles.buttonLabel}>{t('TASK.FOOTER.CONTINUE')}</Text>
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
		alignItems: 'flex-start',
	},
	feedbackText: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 5,
		textAlign: 'left',
		alignSelf: 'flex-start',
		marginLeft: 10,
	},
	correctAnswer: {
		fontSize: 17,
		fontWeight: 'bold',
		color: '#ff4b4b',
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
