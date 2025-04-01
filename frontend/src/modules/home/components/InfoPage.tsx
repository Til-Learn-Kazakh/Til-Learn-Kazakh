import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import { icons } from '../../../core/constants'

export const InfoPage = () => {
    const { t } = useTranslation()
    const navigation = useNavigation<NavigationProp<any>>()

    const handleClose = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Image source={icons.sunfire} style={styles.sunfireIcon} />

            <Text style={styles.title}>
                {t('STREAK_BOTTOM.INFO_STREAK.TITLE')}
            </Text>

            <Text style={styles.subtitle}>
                {t('STREAK_BOTTOM.INFO_STREAK.SUBTITLE')}
            </Text>

            <View style={styles.actionsContainer}>
                <View style={styles.action}>
                    <Image source={icons.learning} style={styles.actionIcon} />
                    <Text style={styles.actionText}>
                        {t('STREAK_BOTTOM.INFO_STREAK.ACTION_LESSON')}
                    </Text>
                </View>
                <View style={styles.action}>
                    <Image source={icons.study} style={styles.actionIcon} />
                    <Text style={styles.actionText}>
                        {t('STREAK_BOTTOM.INFO_STREAK.ACTION_WORDS')}
                    </Text>
                </View>
                <View style={styles.action}>
                    <Image source={icons.task} style={styles.actionIcon} />
                    <Text style={styles.actionText}>
                        {t('STREAK_BOTTOM.INFO_STREAK.ACTION_TASK')}
                    </Text>
                </View>
                <View style={styles.action}>
                    <Image source={icons.book} style={styles.actionIcon} />
                    <Text style={styles.actionText}>
                        {t('STREAK_BOTTOM.INFO_STREAK.ACTION_SERIES')}
                    </Text>
                </View>
            </View>

            <Text style={styles.hint}>{t('STREAK_BOTTOM.INFO_STREAK.HINT')}</Text>

            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>
                    {t('STREAK_BOTTOM.INFO_STREAK.CLOSE')}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        padding: 16,
    },
    sunfireIcon: {
        width: 200,
        height: 200,
        marginTop: 60,
        marginBottom: 10,
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 20,
    },
    actionsContainer: {
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    actionIcon: {
        width: 32,
        height: 32,
        marginRight: 12,
    },
    actionText: {
        fontSize: 16,
        color: '#000000',
    },
    hint: {
        fontSize: 14,
        color: '#555555',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    closeButton: {
        backgroundColor: '#0076CE',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
