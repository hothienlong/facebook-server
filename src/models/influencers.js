import mongoose, { Schema } from 'mongoose';

const Influencers = mongoose.Schema;

export const influencerSchema = new Influencers({
	email: { type: String, required: true },
	password: { type: String, required: true },
	accessToken: { type: String, required: true },
	refreshToken: { type: String, required: true },
	social_network: [
		{
			channel_name: { type: String, required: true, index: true },
			profile_link: { type: String, required: true },
			followers: { type: String },
			total_post: { type: Number },
			engagement_score: { type: Number },
			sentiment_score: { type: Number },
			avg_view: { type: String },
			channel_type: { type: String },
			rating: { type: String },
			rank_country: { type: String },
			social_name: { type: String },
			total_video: { type: String },
			subscribersWeekly: [
				{
					date: { type: String },
					subscribers: { type: Number },
				},
			],
			subscribersMonthly: [
				{
					date: { type: String },
					subscribers: { type: Number },
				},
			],
			subscribersGainedWeekly: [
				{
					date: { type: String },
					subscribers: { type: Number },
				},
			],
		},
	],
	influencer_size: { type: String, index: true },
	inf_score: { type: Number },
	campaign_rating: { type: Number },
	favorite_campaigns: [{ type: Schema.Types.ObjectId }],
	block_companies: [
		{
			company_id: { type: Schema.Types.ObjectId, required: true },
			reason: { type: String, required: true },
		},
	],
	report_companies: [
		{
			company_id: { type: Schema.Types.ObjectId, required: true },
			reason: { type: String, required: true },
			images: [{ type: String }],
		},
	],
	user_detail: {
		type: {
			full_name: { type: String, required: true },
			dob: { type: Date, required: true, index: true },
			career: { type: String, required: true },
			gender: { type: Number, required: true, index: true },
			images: [{ type: String }],
			category: { type: [{ type: String }], index: true },
			bio: { type: String },
			nationality: { type: String },
			city: { type: String },
			religion: { type: String },
			marital_status: { type: String },
			avatar: { type: String },
		},
		required: true,
	},
	campaigns_id: [{ type: Schema.Types.ObjectId }],
});

const influencerModel = mongoose.model('influencers', influencerSchema);
export default influencerModel;