import {
	RecruitmentRepository,
	CreateRecruitmentRequest,
	CreateRecruitmentResponse,
	UploadRecruitmentImageRequest,
	UploadRecruitmentImageResponse,
} from '@/repositories/recruitment'

export type RecruitmentService = {
	createRecruitment: (req: CreateRecruitmentRequest) => Promise<CreateRecruitmentResponse>
	uploadRecruitmentImage: (req: UploadRecruitmentImageRequest) => Promise<UploadRecruitmentImageResponse>
}

type Deps = {
	repositories: [RecruitmentRepository]
}

export const getRecruitmentService = ({ repositories }: Deps): RecruitmentService => ({
	createRecruitment: req => repositories[0].createRecruitment(req),
	uploadRecruitmentImage: req => repositories[0].uploadRecruitmentImage(req),
})
