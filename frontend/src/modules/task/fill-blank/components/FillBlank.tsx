import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import Footer from '../../translate-audio/components/footer/Footer'
import Header from '../../translate-audio/components/header/Header'

import BlankImage from './BlankImage'
import FillBlankMain from './FillBlankMain'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
})

const FillBlank = () => {
	// По умолчанию кнопка неактивна (серого цвета)
	const [actionDone, setActionDone] = useState(false)

	const handleCheck = () => {
		console.log('Нажата кнопка Check')
	}

	return (
		<View style={styles.container}>
			<Header title='Fill in the blank' />
			<BlankImage />
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<FillBlankMain
					words={['Салем', 'үй ', 'бала', 'қарады', 'sentence ']}
					sentence={['Ұстаз', '__', 'тапсырмасын', 'тексерді.']}
					onComplete={setActionDone} // Активируем кнопку после завершения
				/>
			</ScrollView>
			<Footer
				isDisabled={!actionDone}
				onPress={handleCheck}
			/>
		</View>
	)
}

export default FillBlank
