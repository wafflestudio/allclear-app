import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Button from '@/shared/components/Button'
import Checkbox from '@/shared/components/Checkbox'
import { Colors } from '@/shared/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
	visible: boolean
	title: string
	description: string
	onHide: () => void
	onClose: () => void
}

const AnnouncementModal = ({
	visible,
	title,
	description,
	onHide,
	onClose,
}: Props) => {
	const [hideChecked, setHideChecked] = useState(false)
	const { height: windowHeight } = useWindowDimensions()
	const insets = useSafeAreaInsets()

	const modalHeight = Math.min(500, windowHeight - insets.top - insets.bottom - 40)

	const handleDismiss = () => {
		if (hideChecked) {
			onHide()
			return
		}

		onClose()
	}

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
			<View style={styles.overlay}>
				<Pressable style={styles.backdrop} onPress={handleDismiss} />
				<View style={[styles.container, { height: modalHeight }]}>
					<View style={styles.headerSection}>
						<View style={styles.header}>
							<View style={styles.badge}>
								<Text style={styles.badgeText}>공지</Text>
							</View>
							<Pressable style={styles.closeButton} hitSlop={8} onPress={handleDismiss}>
								<Icon name="close" size={22} color={Colors.BODYTEXT_SUB} />
							</Pressable>
						</View>
						<Text style={styles.title}>{title}</Text>
					</View>
					<View style={styles.bodySection}>
						<ScrollView
							style={styles.descriptionScroll}
							showsVerticalScrollIndicator={true}
							bounces={false}
							contentContainerStyle={styles.descriptionContent}>
							<Text style={styles.description}>{description}</Text>
						</ScrollView>
					</View>
					<View style={styles.footer}>
						<Checkbox
							label="다시 보지 않기"
							checked={hideChecked}
							onPress={() => setHideChecked(prev => !prev)}
							style={styles.checkbox}
							textStyle={styles.checkboxLabel}
						/>
						<View style={styles.buttonWrapper}>
							<Button label="확인" onPress={handleDismiss} width={188} style={styles.button} />
						</View>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	container: {
		width: '100%',
		backgroundColor: Colors.POINTCOLOR_SUB,
		borderRadius: 28,
		paddingHorizontal: 24,
		paddingTop: 20,
		paddingBottom: 24,
	},
	headerSection: {
		gap: 18,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	badge: {
		backgroundColor: Colors.POINTCOLOR_10,
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	badgeText: {
		fontSize: 12,
		fontWeight: '700',
		color: Colors.POINTCOLOR,
	},
	closeButton: {
		padding: 2,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: Colors.BODYTEXT_MAIN,
		lineHeight: 30,
	},
	bodySection: {
		marginTop: 16,
		flex: 1,
		minHeight: 0,
	},
	descriptionScroll: {
		flex: 1,
	},
	descriptionContent: {
		paddingRight: 4,
	},
	description: {
		fontSize: 15,
		fontWeight: '400',
		color: Colors.BODYTEXT_SUB,
		lineHeight: 22,
	},
	footer: {
		marginTop: 16,
		gap: 40,
	},
	checkbox: {
		alignSelf: 'flex-start',
	},
	checkboxLabel: {
		fontSize: 13,
		lineHeight: 16,
		color: Colors.POINTCOLOR,
	},
	buttonWrapper: {
		alignItems: 'center',
	},
	button: {
		borderRadius: 12,
	},
})

export default AnnouncementModal
