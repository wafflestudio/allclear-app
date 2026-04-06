import { ImageSourcePropType } from 'react-native'

export type Category = {
	name: '학술' | '종교' | '공연' | '봉사' | '운동' | '홍보' | '취미' | '문화' | '진로'
	description: string
	iconUri: string
	thumbnailUri: string
}

export type CategoryDetail = {
	name: Category['name']
	description: string
	theme: string // hex
	safeArea: string // hex
	icon: ImageSourcePropType
}

export const CategoryMap: Record<Category['name'], CategoryDetail> = {
	학술: {
		name: '학술',
		description: '똑똑한 사람들 사이 더 똑똑한 사람들',
		theme: '#2F65B6',
		safeArea: '#0057DA',
		icon: require(`../assets/images/theme/study-icon.png`),
	},
	종교: {
		name: '종교',
		description: '중요한 가치를 쫒는 사람들',
		theme: '#FFA800',
		safeArea: '#E9A521',
		icon: require(`../assets/images/theme/religion-icon.png`),
	},
	공연: {
		name: '공연',
		description: '박수와 함성, 그 짜릿함을 위하여',
		theme: '#F03F6A',
		safeArea: '#ED256D',
		icon: require(`../assets/images/theme/performance-icon.png`),
	},
	봉사: {
		name: '봉사',
		description: '공부도 잘 하는데 마음도 착해',
		theme: '#8644CE',
		safeArea: '#6A2AD0',
		icon: require(`../assets/images/theme/volunteer-icon.png`),
	},
	운동: {
		name: '운동',
		description: '건강한 몸에 건강한 정신이 깃든다',
		theme: '#F04D04',
		safeArea: '#F07300',
		icon: require(`../assets/images/theme/sports-icon.png`),
	},
	홍보: {
		name: '홍보',
		description: '홍보 동아리를 홍보하는 페이지입니다',
		theme: '#10A997',
		safeArea: '#00A592',
		icon: require(`../assets/images/theme/advertisement-icon.png`),
	},
	취미: {
		name: '취미',
		description: '세상에 즐길 것이 얼마나 많게요',
		theme: '#F579C9',
		safeArea: '#FF6ABB',
		icon: require(`../assets/images/theme/hobby-icon.png`),
	},
	문화: {
		name: '문화',
		description: '대학 탈출 남바완',
		theme: '#8BAA39',
		safeArea: '#779825',
		icon: require(`../assets/images/theme/global-icon.png`),
	},
	진로: {
		name: '진로',
		description: '한국 땅은 나에게 너무 좁다',
		theme: '#57BB3F',
		safeArea: '#52B837',
		icon: require(`../assets/images/theme/career-icon.png`),
	},
}
