import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native'
import CategoryCard from '@/features/home/components/CategoryCard'
import { Colors } from '@/shared/constants/colors'
import { Category } from '@/entities/category'
import { ms, s, vs } from '@/shared/utils/scale'
import { typography } from '@/shared/constants/typography'

const iconMap: Record<Category['name'], ImageSourcePropType> = {
	학술: require('@/assets/icons/category/academic.png'),
	종교: require('@/assets/icons/category/religion.png'),
	봉사: require('@/assets/icons/category/volunteer.png'),
	공연: require('@/assets/icons/category/performance.png'),
	운동: require('@/assets/icons/category/sports.png'),
	홍보: require('@/assets/icons/category/promotion.png'),
	취미: require('@/assets/icons/category/hobby.png'),
	문화: require('@/assets/icons/category/culture.png'),
	진로: require('@/assets/icons/category/career.png'),
}

const categories: Category['name'][] = [
	'학술',
	'종교',
	'봉사',
	'공연',
	'운동',
	'홍보',
	'취미',
	'문화',
	'진로',
]

const CategorySection = () => (
	<View style={styles.container}>
		<View style={styles.topRow}>
			<View style={styles.titleContainer}>
				<Image source={require('@/assets/icons/category-title.png')} style={styles.titleIcon} />
				<View style={styles.titleWrapper}>
					<Text style={styles.subtitle}>원하는 활동이 있으신가요?</Text>
					<Text style={styles.title}>
						<Text style={styles.titleAccent}>카테고리 </Text>모아보기
					</Text>
				</View>
			</View>
			<CategoryCard category={{ name: categories[0] }} icon={iconMap[categories[0]]} />
		</View>
		<View style={styles.grid}>
			{categories.slice(1).map(name => (
				<CategoryCard key={name} category={{ name }} icon={iconMap[name]} />
			))}
		</View>
	</View>
)

export default CategorySection

const styles = StyleSheet.create({
	container: {
		width: s(353),
		height: vs(277),
		borderRadius: ms(16),
		backgroundColor: Colors.BACKGROUND_SUB,
		paddingHorizontal: s(24),
		paddingVertical: vs(20),
		justifyContent: 'center',
		shadowColor: Colors.BLACK,
		shadowOffset: {
			width: 0,
			height: vs(6),
		},
		shadowOpacity: 0.08,
		shadowRadius: ms(12),
		elevation: 5,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flexShrink: 1,
	},
	titleWrapper: {
		flexDirection: 'column',
		justifyContent: 'center',
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: vs(12),
	},
	titleIcon: {
		width: s(43.85),
		height: s(42),
		marginHorizontal: s(8),
	},
	subtitle: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_SUB,
	},
	title: {
		...typography.headerXL,
		color: Colors.BODYTEXT_MAIN,
	},
	titleAccent: {
		color: Colors.POINTCOLOR,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		columnGap: s(8),
		rowGap: vs(12),
	},
})
