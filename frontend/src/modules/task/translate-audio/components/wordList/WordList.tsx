import React from 'react'
import { StyleSheet, View } from 'react-native'

import Lines from './Lines'

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	topArea: {
		flex: 2, // зона результата (2 строки)
		margin: 16,
		position: 'relative',
	},
	linesWrapper: {
		...StyleSheet.absoluteFillObject,
	},
	rowContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		minHeight: 50,
		marginBottom: 10,
	},
	bottomArea: {
		flex: 1, // зона банка
		margin: 16,
	},
})

interface WordListProps {
	row1: React.ReactNode // Первый «ряд»
	row2: React.ReactNode // Второй «ряд»
	bank: React.ReactNode // Банк слов (снизу)
}

const WordList = ({ row1, row2, bank }: WordListProps) => {
	return (
		<View style={styles.container}>
			{/* Верхняя часть с 2мя строками */}
			<View style={styles.topArea}>
				<View style={styles.linesWrapper}>
					<Lines />
				</View>
				{/* Первая линия */}
				<View style={styles.rowContainer}>{row1}</View>
				{/* Вторая линия */}
				<View style={styles.rowContainer}>{row2}</View>
			</View>

			{/* Нижняя часть (банк слов) */}
			<View style={styles.bottomArea}>{bank}</View>
		</View>
	)
}

export default WordList
