import { t } from 'i18next'
import React, { useState } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface OptionGridProps {
	options: string[]
	onOptionPress: (option: string) => void
}

const OptionGrid = ({ options = [], onOptionPress }: OptionGridProps) => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null)

	const handlePress = (option: string) => {
		setSelectedOption(option) // Set selected option
		onOptionPress(option) // Trigger parent function
	}

	return (
		<View style={styles.grid}>
			{options.length > 0 ? (
				options.map(option => (
					<TouchableOpacity
						key={option}
						style={[styles.option, selectedOption === option && styles.selectedOption]}
						onPress={() => handlePress(option)}
					>
						<Text style={[styles.text, selectedOption === option && styles.selectedText]}>
							{option}
						</Text>
					</TouchableOpacity>
				))
			) : (
				<Text>{t('noOptionsAvailable', 'No options available')}</Text> // Localized fallback message
			)}
		</View>
	)
}

const { width } = Dimensions.get('window') // Получаем ширину экрана

const styles = StyleSheet.create({
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between', // Разделяем элементы равномерно
		padding: 16,
	},
	option: {
		width: width * 0.42, // 42% ширины экрана
		paddingVertical: 65, // Вертикальное пространство
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		marginBottom: 16,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 3, // Тень на Android
	},
	selectedOption: {
		backgroundColor: '#0288d1', // Синий цвет для выбранной карточки
	},
	text: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#212529',
	},
	selectedText: {
		color: 'white', // Белый текст для выбранной карточки
	},
})

export default OptionGrid
