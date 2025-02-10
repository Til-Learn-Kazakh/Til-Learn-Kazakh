import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import axios from 'axios'

import FillBlank from '../../fill-blank/components/FillBlank'
import ReadRespond from '../../read-respond/components/ReadRespond'
import TapAudio from '../../tap-audio/components/TapAudio'
import TranslateAudio from '../../translate-audio/components/page/TranslateAudio'
import TranslateWord from '../../translate-word/components/TranslateWord'
import WhatYouHear from '../../what-do-you-hear/components/WhatYouHear'
import WhichIsTrue from '../../which-istrue/components/WhichIsTrue'

const TaskScreen = ({ route }: any) => {
	const { unitId } = route.params
	const [task, setTask] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		axios
			.get(`https://yourapi.com/tasks?unit_id=${unitId}`)
			.then(response => {
				setTask(response.data)
				setLoading(false)
			})
			.catch(error => {
				console.error('Error fetching task:', error)
				setLoading(false)
			})
	}, [unitId])

	if (loading) {
		return (
			<ActivityIndicator
				size='large'
				color='#0000ff'
			/>
		)
	}

	if (!task) {
		return <Text>No Task Found</Text>
	}

	const renderTaskComponent = () => {
		switch (task?.type) {
			case 'translation_word':
				return <TranslateWord task={task} />
			case 'translation_sentence':
				return <TranslateAudio task={task} />
			case 'tap_audio':
				return <TapAudio task={task} />
			case 'audio':
				return <WhatYouHear task={task} />
			case 'choose_correct_image':
				return <WhichIsTrue task={task} />
			case 'complete_text':
				return <FillBlank task={task} />
			case 'read_respond':
				return <ReadRespond task={task} />
			default:
				return <Text>Unknown Task Type</Text>
		}
	}

	return <View style={{ flex: 1 }}>{renderTaskComponent()}</View>
}

export default TaskScreen
