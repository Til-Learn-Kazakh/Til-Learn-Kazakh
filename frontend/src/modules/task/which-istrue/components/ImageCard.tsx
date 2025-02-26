import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'

interface ImageCardProps {
	text: string
	image: { uri: string }
	isSelected: boolean
	onPress: () => void
}

const ImageCard = ({ text, image, isSelected, onPress }: ImageCardProps) => {
	return (
		<TouchableOpacity
			style={[styles.card, isSelected && styles.cardSelected]}
			onPress={onPress}
		>
			<Image
				source={image}
				style={styles.image}
				resizeMode='contain'
			/>
			<Text style={styles.optionText}>{text}</Text>
		</TouchableOpacity>
	)
}

export default ImageCard

const styles = StyleSheet.create({
	card: {
		width: '45%',
		borderWidth: 3,
		borderColor: 'transparent',
		borderRadius: 16,
		marginBottom: 40,
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#f8f9fa',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 6,
	},
	cardSelected: {
		borderColor: '#007BFF',
	},
	image: {
		width: 120,
		height: 120,
		marginBottom: 12,
	},
	optionText: {
		fontSize: 24,
		color: '#333',
		textAlign: 'center',
	},
})
