import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Svg, { Image } from 'react-native-svg'

import { icons } from '../../../../../core/constants'

const CHARACTER_WIDTH = 150
const CHARACTER_ASPECT_RATIO = 560 / 449.75
const styles = StyleSheet.create({
	image: {
		width: CHARACTER_WIDTH,
		height: CHARACTER_WIDTH * CHARACTER_ASPECT_RATIO,
	},
})

const Character = ({ onPress }: { onPress: () => void }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<Svg style={styles.image}>
				<Image
					width='100%'
					height='100%'
					href={icons.soundbarys}
				/>
			</Svg>
		</TouchableOpacity>
	)
}

export default Character
