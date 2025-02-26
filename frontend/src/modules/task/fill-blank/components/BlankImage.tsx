import React from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Image } from 'react-native-svg'

const CHARACTER_WIDTH = 150
const CHARACTER_ASPECT_RATIO = 560 / 449.75

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: CHARACTER_WIDTH,
		height: CHARACTER_WIDTH * CHARACTER_ASPECT_RATIO,
		alignSelf: 'center', // Центрирование внутри родителя
	},
})

const BlankImage = ({ image }: any) => {
	return (
		<View style={styles.container}>
			<Svg style={styles.image}>
				<Image
					href={image}
					width='100%'
					height='100%'
				/>
			</Svg>
		</View>
	)
}

export default BlankImage
