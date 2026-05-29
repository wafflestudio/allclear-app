import { apiConnector } from '@/shared/utils/api'

// ─── Types ────────────────────────────────────────────────────────────────────

export type RegularMeetingPayload = {
	day_of_week: string
	start_time: string
	end_time: string
}

export type CreateRecruitmentRequest = {
	clubId: string
	title: string
	deadline: string
	is_mandatory: boolean
	has_regular_meeting: boolean
	regular_meetings: RegularMeetingPayload[]
	activity_location_type: string
	activity_location_text: string
	has_eligibility: boolean
	eligibility_text: string
	has_capacity_limit: boolean
	capacity_limit_text: string
	has_membership_fee: boolean
	membership_fee_text: string
	application_url: string
	application_process: string
	full_recruitment_text: string
	image_urls: string[]
}

export type CreateRecruitmentResponse = {
	id: string
}

export type UploadRecruitmentImageRequest = {
	clubId: string
	uri: string
	type: string
	name: string
}

export type UploadRecruitmentImageResponse = {
	url: string
}

export type RecruitmentRepository = {
	createRecruitment: (req: CreateRecruitmentRequest) => Promise<CreateRecruitmentResponse>
	uploadRecruitmentImage: (req: UploadRecruitmentImageRequest) => Promise<UploadRecruitmentImageResponse>
}

// ─── Implementation ───────────────────────────────────────────────────────────

export const getRecruitmentRepository = (): RecruitmentRepository => ({
	createRecruitment: async req => {
		const { clubId, ...body } = req
		return apiConnector.post<CreateRecruitmentResponse>(
			`/v2/managers/me/clubs/${clubId}/recruitments`,
			body,
		)
	},

	uploadRecruitmentImage: async req => {
		const formData = new FormData()
		formData.append('file', {
			uri: req.uri,
			type: req.type,
			name: req.name,
		} as unknown as Blob)

		return apiConnector.post<UploadRecruitmentImageResponse>(
			`/v2/managers/me/clubs/${req.clubId}/images`,
			formData as unknown as object,
			{ timeout: 60000, headers: { 'Content-Type': 'multipart/form-data' } },
		)
	},
})
