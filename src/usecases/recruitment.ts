import {
	RecruitmentRepository,
	ListClubRecruitmentsRequest,
	ListClubRecruitmentsResponse,
	CreateRecruitmentRequest,
	CreateRecruitmentResponse,
	UploadRecruitmentImageRequest,
	UploadRecruitmentImageResponse,
} from '@/repositories/recruitment'

export type RecruitmentService = {
	listClubRecruitments: (req: ListClubRecruitmentsRequest) => Promise<ListClubRecruitmentsResponse>
	createRecruitment: (req: CreateRecruitmentRequest) => Promise<CreateRecruitmentResponse>
	uploadRecruitmentImage: (
		req: UploadRecruitmentImageRequest,
	) => Promise<UploadRecruitmentImageResponse>
}

type Deps = {
	repositories: [RecruitmentRepository]
}

export const getRecruitmentService = ({ repositories }: Deps): RecruitmentService => ({
	listClubRecruitments: req => repositories[0].listClubRecruitments(req),
	createRecruitment: req => repositories[0].createRecruitment(req),
	uploadRecruitmentImage: req => repositories[0].uploadRecruitmentImage(req),
})
