import React, { ReactElement, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { runOnJS, runOnUI, useSharedValue } from 'react-native-reanimated'

import { MARGIN_LEFT } from '../word/Layout'

import Lines from './Lines'
import SortableWord from './SortableWord'

const containerWidth = Dimensions.get('window').width - MARGIN_LEFT * 2
const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: MARGIN_LEFT,
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		opacity: 0,
	},
})

interface WordListProps {
	children: ReactElement<{ id: number }>[]
	// Колбэк, вызываемый после того, как все слова переставлены
	onFinish?: () => void
}

const WordList = ({ children, onFinish }: WordListProps) => {
	const [ready, setReady] = useState(false)
	const offsets = children.map(() => ({
		order: useSharedValue(0),
		width: useSharedValue(0),
		height: useSharedValue(0),
		x: useSharedValue(0),
		y: useSharedValue(0),
		originalX: useSharedValue(0),
		originalY: useSharedValue(0),
	}))

	if (!ready) {
		return (
			<View style={styles.row}>
				{children.map((child, index) => {
					return (
						<View
							key={index}
							onLayout={({
								nativeEvent: {
									layout: { x, y, width, height },
								},
							}) => {
								const offset = offsets[index]!
								// По умолчанию слово находится в банке: order = -1
								offset.order.value = -1
								offset.width.value = width
								offset.height.value = height
								offset.originalX.value = x
								offset.originalY.value = y
								runOnUI(() => {
									'worklet'
									if (offsets.filter(o => o.order.value !== -1).length === 0) {
										runOnJS(setReady)(true)
									}
								})()
							}}
						>
							{child}
						</View>
					)
				})}
			</View>
		)
	}

	// Функция для проверки, что все слова переставлены (то есть, ни одно слово не в банке)
	const checkAllPlaced = () => {
		const allPlaced = offsets.every(o => o.order.value !== -1)
		if (allPlaced && onFinish) {
			onFinish()
		}
	}

	return (
		<View style={styles.container}>
			<Lines />
			{children.map((child, index) => (
				<SortableWord
					key={index}
					offsets={offsets}
					index={index}
					containerWidth={containerWidth}
					onDrop={checkAllPlaced} // Передаём callback, который вызывается при завершении перетаскивания
				>
					{child}
				</SortableWord>
			))}
		</View>
	)
}

export default WordList
