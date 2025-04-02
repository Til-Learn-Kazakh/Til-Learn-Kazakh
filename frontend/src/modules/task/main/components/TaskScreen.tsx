import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { LoadingUi } from '../../../../core/ui/LoadingUi'
import { useCurrentUser } from '../../../auth/hooks/user-current-user.hook'
import { useLevels } from '../../../home/hooks/home.hooks'
import FillBlank from '../../fill-blank/components/FillBlank'
import ReadRespond from '../../read-respond/components/ReadRespond'
import TapAudio from '../../tap-audio/components/TapAudio'
import Header from '../../translate-audio/components/header/Header'
import TranslateAudio from '../../translate-audio/components/page/TranslateAudio'
import TranslateWord from '../../translate-word/components/TranslateWord'
import WhatYouHear from '../../what-do-you-hear/components/WhatYouHear'
import WhichIsTrue from '../../which-istrue/components/WhichIsTrue'
import { useTask } from '../hooks/task.hook'
import { taskService } from '../services/task.service'

import RefillBottomSheet from './RefillBottomSheet'

const TaskScreen = ({ route }: any) => {
	const { unitId } = route.params
	const [currentOrder, setCurrentOrder] = useState(0)
	const navigation = useNavigation<NavigationProp<any>>()
	const { data: currentUser } = useCurrentUser()
	const hearts = currentUser?.hearts || 0

	const [isFinished, setIsFinished] = useState(false)
	const { t, i18n } = useTranslation()

	// Track time
	const [startTime, setStartTime] = useState(Date.now())
	const [correctAnswers, setCorrectAnswers] = useState(0)
	const [mistakes, setMistakes] = useState(0)
	const [combo, setCombo] = useState(0)
	const [maxCombo, setMaxCombo] = useState(0)

	const { data: levels } = useLevels() // Get all levels

	const currentSection = levels?.find((section: any) =>
		section.units.some((unit: any) => unit.id === unitId)
	)
	const currentUnit = currentSection?.units.find((unit: any) => unit.id === unitId)
	const totalTasks = currentUnit?.tasks.length || 1
	const progress = ((currentOrder + 1) / totalTasks) * 100

	const { data: task, isLoading, isError } = useTask(unitId, currentOrder)
	const refillBottomSheetRef = useRef<BottomSheetModal>(null)

	useEffect(() => {
		if (hearts === 0) {
			if (refillBottomSheetRef.current) {
				refillBottomSheetRef.current.present()
			}
		}
	}, [hearts])

	useEffect(() => {
		navigation.setOptions({ gestureEnabled: false })
	}, [navigation])

	const accuracy = totalTasks > 0 ? Math.round((correctAnswers / totalTasks) * 100) : 0
	const committedTime = Math.floor((Date.now() - startTime) / 1000)
	const formattedTime = `${Math.floor(committedTime / 60)}:${committedTime % 60 < 10 ? '0' : ''}${committedTime % 60}`

	const handleNextTask = async () => {
		if (currentOrder + 1 < totalTasks) {
			setCurrentOrder(prev => prev + 1)
		} else {
			try {
				setIsFinished(true) // Блокируем ререндер последнего задания
				// ✅ Отправляем данные через `taskService.calculateXP()`
				const correct = correctAnswers
				const attempts = totalTasks
				const responseData = await taskService.calculateXP(
					unitId,
					correct,
					attempts,
					committedTime,
					mistakes,
					maxCombo
				)

				navigation.reset({
					index: 0,
					routes: [
						{
							name: 'LessonCompleteScreen',
							params: {
								accuracy: responseData.accuracy,
								committedTime: formattedTime,
								xpEarned: responseData.xpEarned,
							},
						},
					],
				})
			} catch (error) {
				console.error('Ошибка при отправке данных на бэкенд:', error)
				setIsFinished(false) // Если ошибка, отменяем блокировку
			}
		}
	}

	const handleCorrectAnswer = () => {
		setCorrectAnswers(prev => prev + 1)
		setCombo(prev => {
			const newCombo = prev + 1
			if (newCombo > maxCombo) {
				setMaxCombo(newCombo)
			}
			return newCombo
		})
	}

	const handleMistake = () => {
		setMistakes(prev => prev + 1)
		setCombo(0)
	}

	if (isLoading || isFinished) {
		return <LoadingUi />
	}

	if (isError || !task) {
		return <Text>{t('ERROR_LOADING')}</Text>
	}

	const renderTaskComponent = () => {
		switch (task.type) {
			case 'translation_word':
				return (
					<TranslateWord
						key={task.id}
						task={task}
						onNext={handleNextTask}
						hearts={hearts}
						bottomSheetRef={refillBottomSheetRef}
						onCorrectAnswer={handleCorrectAnswer}
						onMistake={handleMistake}
					/>
				)
			case 'fill_blank':
				return (
					<FillBlank
						key={task.id}
						task={task}
						onNext={handleNextTask}
						hearts={hearts}
						bottomSheetRef={refillBottomSheetRef}
						onCorrectAnswer={handleCorrectAnswer}
						onMistake={handleMistake}
					/>
				)
			case 'read_respond':
				return (
					<ReadRespond
						task={task}
						onNext={handleNextTask}
						hearts={hearts}
						bottomSheetRef={refillBottomSheetRef}
						onCorrectAnswer={handleCorrectAnswer}
						onMistake={handleMistake}
					/>
				)
			case 'choose_correct_image':
				return (
					<WhichIsTrue
						task={task}
						onNext={handleNextTask}
						hearts={hearts}
						bottomSheetRef={refillBottomSheetRef}
						onCorrectAnswer={handleCorrectAnswer}
						onMistake={handleMistake}
					/>
				)
			case 'audio':
				return (
					<WhatYouHear
						task={task}
						onNext={handleNextTask}
						hearts={hearts}
						bottomSheetRef={refillBottomSheetRef}
						onCorrectAnswer={handleCorrectAnswer}
						onMistake={handleMistake}
					/>
				)
			case 'tap_audio':
				return (
					<TapAudio
						task={task}
						onNext={handleNextTask}
						hearts={hearts}
						bottomSheetRef={refillBottomSheetRef}
						onCorrectAnswer={handleCorrectAnswer}
						onMistake={handleMistake}
					/>
				)
			case 'translation_audio':
				return (
					<TranslateAudio
						task={task}
						onNext={handleNextTask}
						hearts={hearts}
						bottomSheetRef={refillBottomSheetRef}
						onCorrectAnswer={handleCorrectAnswer}
						onMistake={handleMistake}
					/>
				)
			default:
				return <Text>{t('TASK.UNKNOWN_TYPE')}</Text>
		}
	}

	return (
		<BottomSheetModalProvider>
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<Header
					title={task?.question?.[i18n.language] || task?.question?.en || ''}
					progress={progress}
				/>

				{renderTaskComponent()}

				<RefillBottomSheet bottomSheetRef={refillBottomSheetRef} />
			</View>
		</BottomSheetModalProvider>
	)
}

export default TaskScreen
