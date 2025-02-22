import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ImageWithOptionsProps {
	image: any
	options: string[]
	selectedOption: string | null
	onOptionSelect: (option: string) => void
	isDisabled: boolean
}

const ImageWithOptions = ({
	image,
	options,
	selectedOption,
	onOptionSelect,
	isDisabled,
}: ImageWithOptionsProps) => {
	return (
		<View style={styles.container}>
			{/* Image in the Center */}
			<Image
				source={{ uri: image }}
				style={styles.image}
				resizeMode='contain'
				onError={error => console.log('Image Load Error:', error.nativeEvent)}
			/>

			{/* Options */}
			<View style={styles.optionsContainer}>
				{options.map((option, index) => (
					<TouchableOpacity
						key={index}
						style={[styles.optionButton, selectedOption === option && styles.selectedOption]}
						onPress={() => !isDisabled && onOptionSelect(option)}
						disabled={isDisabled}
					>
						<Text
							style={[styles.optionText, selectedOption === option && styles.selectedOptionText]}
						>
							{option}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	)
}

export default ImageWithOptions

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginTop: 40,
	},
	image: {
		width: 200,
		height: 200,
		marginBottom: 20,
	},
	optionsContainer: {
		width: '100%',
	},
	optionButton: {
		backgroundColor: '#f0f0f0',
		paddingVertical: 15,
		marginBottom: 15,
		borderRadius: 12,
		alignItems: 'center',
	},
	optionText: {
		fontSize: 18,
		color: '#333',
	},
	selectedOption: {
		backgroundColor: '#007BFF',
	},
	selectedOptionText: {
		color: 'white',
		fontWeight: 'bold',
	},
})
