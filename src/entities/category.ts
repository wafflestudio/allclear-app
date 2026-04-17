import { ImageSourcePropType } from 'react-native'

export type Category = {
	name: '학술' | '종교' | '공연' | '봉사' | '운동' | '홍보' | '취미' | '문화' | '진로'
	description: string
	iconUri: string
	thumbnailUri: string
}

export type CategoryDetail = {
	name: Category['name']
	themeColor: string
	icon: ImageSourcePropType
}

export const CategoryMap: Record<Category['name'], CategoryDetail> = {
	학술: {
		name: '학술',
		themeColor: '#2486FF',
		icon: require('@/assets/images/theme/study-icon.png'),
	},
	종교: {
		name: '종교',
		themeColor: '#DDD0B8',
		icon: require('@/assets/images/theme/religion-icon.png'),
	},
	봉사: {
		name: '봉사',
		themeColor: '#FF8F4A',
		icon: require('@/assets/images/theme/volunteer-icon.png'),
	},
	공연: {
		name: '공연',
		themeColor: '#E6F672',
		icon: require('@/assets/images/theme/performance-icon.png'),
	},
	운동: {
		name: '운동',
		themeColor: '#86E0D7',
		icon: require('@/assets/images/theme/sports-icon.png'),
	},
	홍보: {
		name: '홍보',
		themeColor: '#FFCE62',
		icon: require('@/assets/images/theme/advertisement-icon.png'),
	},
	취미: {
		name: '취미',
		themeColor: '#F05678',
		icon: require('@/assets/images/theme/hobby-icon.png'),
	},
	문화: {
		name: '문화',
		themeColor: '#B7C995',
		icon: require('@/assets/images/theme/global-icon.png'),
	},
	진로: {
		name: '진로',
		themeColor: '#847876',
		icon: require('@/assets/images/theme/career-icon.png'),
	},
}
