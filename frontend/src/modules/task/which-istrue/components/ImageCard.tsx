import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'

interface ImageCardProps {
	text: string
	image: any
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
		width: '45%', // Increased card width
		borderWidth: 3,
		borderColor: 'transparent',
		borderRadius: 16, // Slightly more rounded corners
		marginBottom: 40,
		alignItems: 'center',
		padding: 16, // Added more padding
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
		width: 120, // Increased image size
		height: 120,
		marginBottom: 12,
	},
	optionText: {
		fontSize: 24, // Increased font size for text
		color: '#333',
		textAlign: 'center',
	},
})
