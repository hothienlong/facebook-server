import mongoose, { Schema } from 'mongoose';

const Influencers = mongoose.Schema;

export const influencerSchema = new Influencers({
	email: { type: String, required: true, index: true },
	password: { type: String, required: true },
	accessToken: { type: String, required: true },
	refreshToken: { type: String, required: true },
	social_network: [
		{
			channel_name: { type: String, required: true, index: true },
			profile_link: { type: String },
			followers: { type: String },
			total_post: { type: Number },
			engagement_score: { type: Number },
			sentiment_score: { type: Number },
			avg_view: { type: String },
			total_video: { type: String },
			social_name: { type: String },
			description: { type: String },
			fScore: { type: Number },
			error_link: { type: Boolean },
			user_name: { type: String }, // user name of twitter
			social_id: { type: String }, // channel id, id of twitter
			time_update: { type: Date },
			is_crawl: { type: Boolean },
			access_token: { type: String }, // facebook access token
		},
	],
	influencer_size: { type: String, index: true },
	inf_score: { type: Number },
	campaign_rating: { type: Number },
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
			categories: { type: [{ type: String }], index: true },
			bio: { type: String },
			city: { type: String },
			religion: { type: String },
			marital_status: { type: String },
			avatar: { type: String },
			rank: { type: String, required: true },
			rank_score: { type: Number, required: true },
			list_chat_user_id: [{ type: String }],
		},
		required: true,
	},
	campaigns_id: [{ type: Schema.Types.ObjectId }],
	notifications: [
		{
			title: { type: String, required: true },
			content: { type: String, required: true },
			noti_date: { type: Date, required: true },
		},
	],
	wallet_id: { type: Schema.Types.ObjectId, ref: 'wallets' },
});

const influencerModel = mongoose.model('influencers', influencerSchema);
export default influencerModel;
