import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Svg, { Image } from 'react-native-svg'

import { icons } from '../../../../core/constants'

const CHARACTER_WIDTH = 120
const CHARACTER_ASPECT_RATIO = 560 / 449.75

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: CHARACTER_WIDTH,
		height: CHARACTER_WIDTH * CHARACTER_ASPECT_RATIO,
		alignSelf: 'center',
	},
})

const SoundImage = ({ onPress }: { onPress: () => void }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={styles.container}
		>
			<Svg style={styles.image}>
				<Image
					width='100%'
					height='100%'
					href={icons.sound}
				/>
			</Svg>
		</TouchableOpacity>
	)
}

export default SoundImage
