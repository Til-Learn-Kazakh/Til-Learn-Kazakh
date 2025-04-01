import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { icons } from '../../../../../core/constants'

export const CloseBottomsheet = ({ onClose }: { onClose: () => void }) => {
	const navigation = useNavigation<NavigationProp<any>>()
	const { t } = useTranslation()

	const onCloseClick = useCallback(() => {
		onClose()
	}, [onClose])

	const onEndSession = useCallback(() => {
		onClose()
		navigation.reset({
			index: 0,
			routes: [{ name: 'Home' }],
		})
	}, [navigation, onClose])

	return (
		<BottomSheetScrollView contentContainerStyle={styles.container}>
			{/* Image */}
			<Image
				source={icons.loseheart}
				style={styles.image}
			/>

			{/* Localized Texts */}
			<Text style={styles.title}>{t('TASK.CLOSE_BOTTOMSHEET.TITLE')}</Text>
			<Text style={styles.subtitle}>{t('TASK.CLOSE_BOTTOMSHEET.SUBTITLE')}</Text>

			{/* Buttons */}
			<TouchableOpacity
				style={styles.keepLearningButton}
				onPress={onCloseClick}
			>
				<Text style={styles.keepLearningText}>{t('TASK.CLOSE_BOTTOMSHEET.KEEP_LEARNING')}</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.endSessionButton}
				onPress={onEndSession}
			>
				<Text style={styles.endSessionText}>{t('TASK.CLOSE_BOTTOMSHEET.END_SESSION')}</Text>
			</TouchableOpacity>
		</BottomSheetScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		padding: 20,
	},
	image: {
		width: 100,
		height: 80,
		marginBottom: 16,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#333',
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		color: '#666',
		marginBottom: 25,
		marginTop: 10,
	},
	keepLearningButton: {
		backgroundColor: '#0076CE',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
		width: '100%',
		alignItems: 'center',
		marginBottom: 10,
	},
	keepLearningText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	endSessionButton: {
		paddingVertical: 10,
		borderRadius: 8,
		width: '100%',
		alignItems: 'center',
		marginBottom: 10,
	},
	endSessionText: {
		color: '#0076CE',
		fontSize: 16,
		fontWeight: 'bold',
	},
})

export default CloseBottomsheet
