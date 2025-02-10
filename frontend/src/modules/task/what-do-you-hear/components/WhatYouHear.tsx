import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import SoundImage from '../../tap-audio/components/SoundImage'
import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'

import OptionGrid from './OptionGrid'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
})

const WhatYouHear = () => {
	// По умолчанию кнопка неактивна (серого цвета)
	const [actionDone, setActionDone] = useState(false)
	const [selectedOption, setSelectedOption] = useState<string | null>(null)

	const options = ['Салем', 'райм', 'бола', 'аза'] // Варианты ответов

	const handleOptionPress = (option: string) => {
		setSelectedOption(option)
		setActionDone(true) // Активируем кнопку после выбора
		console.log(`Выбрана опция: ${option}`)
	}

	const handleCheck = () => {
		console.log(`Нажата кнопка Check. Выбранный ответ: ${selectedOption}`)
	}

	return (
		<View style={styles.container}>
			<Header title='What do you hear?' />
			<SoundImage />
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<OptionGrid
					options={options}
					onOptionPress={handleOptionPress}
				/>
			</ScrollView>
			<Footer
				isDisabled={!actionDone}
				onPress={handleCheck}
			/>
		</View>
	)
}

export default WhatYouHear
