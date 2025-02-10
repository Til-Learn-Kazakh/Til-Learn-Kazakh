import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import { CROSS_SIZE } from './Cross'
import { HEART_SIZE } from './Heart'

const screenWidth = Dimensions.get('window').width
const padding = 16 * 4.3
const containerWidth = screenWidth - padding - CROSS_SIZE - HEART_SIZE
const svgHeight = (containerWidth * 11) / 111
const maxLineWidth = 99.55 

const Progress = ({ progress = 10 }) => {
	const safeProgress = Math.max(0, Math.min(progress, 100)) 
	const progressWidth = (safeProgress / 100) * maxLineWidth 

	return (
		<View style={styles.container}>
			<Svg
				width={containerWidth}
				height={svgHeight}
				viewBox='0 0 111 11'
			>
				<Path
					d='M5.5 5.5h99.55'
					stroke='#E4E4E4'
					strokeWidth={10}
					strokeLinecap='round'
				/>

				<Path
					d={`M5.5 5.5h${progressWidth}`}
					stroke='#0286FF'
					strokeWidth={10}
					strokeLinecap='round'
				/>
			</Svg>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
})

export default Progress
