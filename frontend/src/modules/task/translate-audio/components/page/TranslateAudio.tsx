import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import Footer from '../footer/Footer'
import Header from '../header/Header'
import Word from '../word/Word'
import WordList from '../wordList/WordList'

import Character from './Character'

const words = [
	{ id: 1, word: 'Bolatbek' },
	{ id: 8, word: 'good' },
	{ id: 2, word: 'boybhb' },
	{ id: 7, word: 'son' },
	{ id: 6, word: 'well' },
	{ id: 9, word: 'what' },
	{ id: 5, word: 'apple' },
	{ id: 3, word: 'kalai' },
	{ id: 4, word: 'What' },
]

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
})

const TranslateAudio = () => {
	// По умолчанию кнопка неактивна (серого цвета)
	const [actionDone, setActionDone] = useState(false)

	const handleCheck = () => {
		console.log('Нажата кнопка Check')
	}

	return (
		<View style={styles.container}>
			<Header title='Translate this sentence' /> 
			<Character />
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<WordList onFinish={() => setActionDone(true)}>
					{words.map(word => (
						<Word
							key={word.id}
							{...word}
						/>
					))}
				</WordList>
			</ScrollView>
			<Footer
				isDisabled={!actionDone}
				onPress={handleCheck}
			/>
		</View>
	)
}

export default TranslateAudio
