import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import FillBlank from '../../fill-blank/components/FillBlank'
import ReadRespond from '../../read-respond/components/ReadRespond'
import TapAudio from '../../tap-audio/components/TapAudio'
import TranslateAudio from '../../translate-audio/components/page/TranslateAudio'
import TranslateWord from '../../translate-word/components/TranslateWord'
import WhatYouHear from '../../what-do-you-hear/components/WhatYouHear'
import WhichIsTrue from '../../which-istrue/components/WhichIsTrue'
import { useTask } from '../hooks/task.hook'

const TaskScreen = ({ route }: any) => {
	const { unitId } = route.params
	const [currentOrder, setCurrentOrder] = useState(0)
	const navigation = useNavigation()

	// Load current task
	const { data: task, isLoading, isError } = useTask(unitId, currentOrder)

	useEffect(() => {
		navigation.setOptions({ gestureEnabled: false })
	}, [navigation])

	const handleNextTask = () => {
		if (task) {
			setCurrentOrder(prev => prev + 1)
		}
	}

	if (isLoading) {
		return (
			<ActivityIndicator
				size='large'
				color='#0000ff'
			/>
		)
	}

	if (isError || !task) {
		return <Text>Error loading task</Text>
	}

	const renderTaskComponent = () => {
		switch (task.type) {
			case 'translation_word':
				return (
					<TranslateWord
						key={task.id}
						task={task}
						onNext={handleNextTask}
					/>
				)
			case 'fill_blank':
				return (
					<FillBlank
						key={task.id}
						task={task}
						onNext={handleNextTask}
					/>
				)
			case 'read_respond':
				return (
					<ReadRespond
						task={task}
						onNext={handleNextTask}
					/>
				)
			case 'choose_correct_image':
				return (
					<WhichIsTrue
						task={task}
						onNext={handleNextTask}
					/>
				)
			case 'audio':
				return (
					<WhatYouHear
						task={task}
						onNext={handleNextTask}
					/>
				)
			case 'tap_audio':
				return (
					<TapAudio
						task={task}
						onNext={handleNextTask}
					/>
				)

			case 'translation_audio':
				return (
					<TranslateAudio
						task={task}
						onNext={handleNextTask}
					/>
				)

			default:
				return <Text>Unknown Task Type</Text>
		}
	}

	return <View style={{ flex: 1 }}>{renderTaskComponent()}</View>
}

export default TaskScreen
