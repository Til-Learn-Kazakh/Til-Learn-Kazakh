import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Cross from './Cross'
import Heart from './Heart'
import Progress from './Progress'

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		padding: 16,
		marginTop: 52,
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	title: {
		fontFamily: 'Nunito-Bold',
		fontSize: 24,
		paddingLeft: 16,
	},
})

const Header = ({ title }: { title: string }) => {
	return (
		<View>
			<View style={styles.row}>
				<Cross />
				<Progress />
				<Heart />
			</View>
			<Text style={styles.title}>{title}</Text>
		</View>
	)
}

export default Header
