import React, { useState } from 'react'
import {
	Dimensions,
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

// LOCAL IMAGES
const Aza = require('../../../../assets/Aza.jpg')
const Bolatbek = require('../../../../assets/Bolatbek.png')
const Raim = require('../../../../assets/Raim.jpg')

const { width } = Dimensions.get('window')

// Helper function to handle local vs. remote
function getImageSource(value: any) {
	// If it's a number => it's a local require()
	if (typeof value === 'number') {
		return value
	}
	// Otherwise => treat as a remote URI
	return { uri: value }
}

// Example data for Weekly
const weeklyLeaders = [
	{
		id: '1',
		name: 'Isabella',
		points: 1685,
		avatarUri: 'https://i.pravatar.cc/100?img=10',
	},
	{
		id: '2',
		name: 'Evelyn',
		points: 1608,
		avatarUri: 'https://i.pravatar.cc/100?img=12',
	},
	{
		id: '3',
		name: 'Sophia',
		points: 1580,
		avatarUri: 'https://i.pravatar.cc/100?img=1',
	},
	{
		id: '4',
		name: 'William',
		points: 1536,
		avatarUri: 'https://i.pravatar.cc/100?img=2',
	},
	{
		id: '5',
		name: 'Abigail',
		points: 1510,
		avatarUri: 'https://i.pravatar.cc/100?img=3',
	},
	{
		id: '6',
		name: 'James',
		points: 1500,
		avatarUri: 'https://i.pravatar.cc/100?img=4',
	},
]

// Example data for All Time
const allTimeLeaders = [
	{
		id: '1',
		name: 'Bolatbek',
		points: 21500,
		avatarUri: Bolatbek, // local image
	},
	{
		id: '2',
		name: 'Raim',
		points: 19800,
		avatarUri: Raim, // local image
	},
	{
		id: '3',
		name: 'Azamat',
		points: 18350,
		avatarUri: Aza, // local image
	},
	{
		id: '4',
		name: 'Olivia',
		points: 17900,
		avatarUri: 'https://i.pravatar.cc/100?img=8',
	},
	{
		id: '5',
		name: 'Ethan',
		points: 17400,
		avatarUri: 'https://i.pravatar.cc/100?img=9',
	},
]

// Example internet URLs for medals
const goldMedalIcon = 'https://cdn-icons-png.flaticon.com/512/2583/2583341.png'
const silverMedalIcon = 'https://cdn-icons-png.flaticon.com/512/2583/2583329.png'
const bronzeMedalIcon = 'https://cdn-icons-png.flaticon.com/512/2583/2583351.png'

const LeaderboardScreen = () => {
	const [tab, setTab] = useState('Weekly')

	// Pick which array we show
	const currentLeaders = tab === 'Weekly' ? weeklyLeaders : allTimeLeaders

	// Top 3
	const top3 = currentLeaders.slice(0, 3)
	// The rest
	const rest = currentLeaders.slice(3)

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.headerText}>Leaderboard</Text>

			<View style={styles.tabContainer}>
				<TouchableOpacity
					onPress={() => setTab('Weekly')}
					style={[styles.tabButton, tab === 'Weekly' && styles.activeTabButton]}
				>
					<Text style={[styles.tabButtonText, tab === 'Weekly' && styles.activeTabButtonText]}>
						Weekly
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setTab('AllTime')}
					style={[styles.tabButton, tab === 'AllTime' && styles.activeTabButton]}
				>
					<Text style={[styles.tabButtonText, tab === 'AllTime' && styles.activeTabButtonText]}>
						All Time
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.top3Container}>
				{top3[1] && (
					<View style={[styles.podiumItem, { marginRight: 10 }]}>
						<Image
							source={getImageSource(top3[1].avatarUri)}
							style={styles.avatarTop3}
						/>
						<Image
							source={{ uri: silverMedalIcon }}
							style={styles.medalIcon}
						/>
						<Text style={styles.nameText}>{top3[1].name}</Text>
						<Text style={styles.pointsText}>{top3[1].points} xp</Text>
					</View>
				)}

				{/* 1st place */}
				{top3[0] && (
					<View style={[styles.podiumItem, styles.firstPlace]}>
						<Image
							source={getImageSource(top3[0].avatarUri)}
							style={styles.avatarTop3}
						/>
						<Image
							source={{ uri: goldMedalIcon }}
							style={styles.medalIcon}
						/>
						<Text style={styles.nameText}>{top3[0].name}</Text>
						<Text style={styles.pointsText}>{top3[0].points} xp</Text>
					</View>
				)}

				{/* 3rd place */}
				{top3[2] && (
					<View style={[styles.podiumItem, { marginLeft: 10 }]}>
						<Image
							source={getImageSource(top3[2].avatarUri)}
							style={styles.avatarTop3}
						/>
						<Image
							source={{ uri: bronzeMedalIcon }}
							style={styles.medalIcon}
						/>
						<Text style={styles.nameText}>{top3[2].name}</Text>
						<Text style={styles.pointsText}>{top3[2].points} xp</Text>
					</View>
				)}
			</View>

			{/* --- The rest --- */}
			<FlatList
				data={rest}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item, index }) => {
					const position = index + 4
					return (
						<View style={styles.itemContainer}>
							<Text style={styles.positionText}>{position}</Text>
							<Image
								source={getImageSource(item.avatarUri)}
								style={styles.avatar}
							/>
							<View style={{ flex: 1, marginLeft: 10 }}>
								<Text style={styles.itemName}>{item.name}</Text>
							</View>
							<Text style={styles.itemPoints}>{item.points} xp</Text>
						</View>
					)
				}}
			/>
		</SafeAreaView>
	)
}

export default LeaderboardScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#E6F0FA',
	},
	headerText: {
		fontSize: 24,
		fontWeight: '700',
		alignSelf: 'center',
		marginTop: 16,
		marginBottom: 8,
		color: '#0A84FF',
	},
	tabContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginBottom: 16,
		backgroundColor: '#fff',
		borderRadius: 20,
		overflow: 'hidden',
	},
	tabButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	tabButtonText: {
		fontSize: 16,
		color: '#555',
	},
	activeTabButton: {
		backgroundColor: '#0A84FF',
	},
	activeTabButtonText: {
		color: '#fff',
	},

	/* --- Podium --- */
	top3Container: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 20,
	},
	podiumItem: {
		width: width * 0.28,
		backgroundColor: '#fff',
		borderRadius: 16,
		alignItems: 'center',
		paddingVertical: 10,
	},
	firstPlace: {
		marginTop: -20,
		width: width * 0.3,
	},
	avatarTop3: {
		width: 70,
		height: 70,
		borderRadius: 35,
		marginBottom: 4,
		resizeMode: 'cover',
	},
	medalIcon: {
		width: 24,
		height: 24,
		resizeMode: 'contain',
		marginBottom: 2,
	},
	nameText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	pointsText: {
		fontSize: 14,
		color: '#777',
	},

	/* --- Others list --- */
	listContent: {
		paddingHorizontal: 16,
		paddingBottom: 40,
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 12,
		marginBottom: 10,
		padding: 12,
	},
	positionText: {
		fontSize: 16,
		fontWeight: '600',
		width: 24,
		textAlign: 'center',
		color: '#555',
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		resizeMode: 'cover',
	},
	itemName: {
		fontSize: 16,
		fontWeight: '500',
		color: '#333',
	},
	itemPoints: {
		fontSize: 15,
		fontWeight: '500',
		color: '#0A84FF',
	},
})
