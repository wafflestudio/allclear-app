import { Modal, Pressable, View, StyleSheet, Text } from 'react-native'
import { Colors } from '@/shared/constants/colors'
import Button from '@/shared/components/Button'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

type Props = {
	visible: boolean
	onClose: () => void
	title: string
	description: string
	buttonLabel: string
	onButtonPress: () => void
	buttonVariant?: ButtonVariant
	hasCancel?: boolean
	cancelLabel?: string
	dismissOnBackdropPress?: boolean
}

const AlertModal = ({
	visible,
	onClose,
	title,
	description,
	buttonLabel,
	onButtonPress,
	buttonVariant = 'primary',
	hasCancel = false,
	cancelLabel = '취소',
	dismissOnBackdropPress = true,
}: Props) => {
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<Pressable style={styles.overlay} onPress={dismissOnBackdropPress ? onClose : undefined}>
				<Pressable style={styles.container} onPress={e => e.stopPropagation()}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.description}>{description}</Text>
					<View style={styles.buttonArea}>
						{hasCancel && <Button label={cancelLabel} onPress={onClose} variant="outline" />}
						<Button label={buttonLabel} onPress={onButtonPress} variant={buttonVariant} />
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	)
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // #deprecated color
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	container: {
		width: '100%',
		backgroundColor: '#FFFFFF', // #deprecated color
		borderRadius: 16,
		padding: 24,
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		color: '#212121', // #deprecated color
		textAlign: 'center',
	},
	description: {
		fontSize: 14,
		fontWeight: '400',
		color: '#212121', // #deprecated color
		textAlign: 'center',
		marginTop: 12,
	},
	buttonArea: {
		flexDirection: 'row',
		gap: 8,
		marginTop: 24,
	},
})

export default AlertModal
