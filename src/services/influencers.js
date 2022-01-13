import influencerModel from '../models/influencers';
const ObjectID = require('mongodb').ObjectId;
import { INFLUENCER_SIZE } from '../constants';

export const updateInfluencer = async (
	influencer_id,
	social_name,
	profile_link,
	followers,
	engagement_score,
	influencer_size
) => {
	try {
		console.log('updateInfluencer service');

		console.log(influencer_id);

		// get influencer hasn't connected facebook yet
		const influencer = await influencerModel.findOne({
			_id: ObjectID(influencer_id),
			'social_network.channel_name': { $ne: 'facebook' },
		});
		// console.log(influencer);

		if (!influencer) {
			return {
				status: false,
				message: 'Influencer has connected facebook already',
			};
		}

		await influencer.social_network.push({
			channel_name: 'facebook',
			social_name: social_name,
			profile_link: profile_link,
			followers: followers,
			engagement_score: engagement_score,
		});

		// if influencer hasn't connected facebook -> add a new one

		if (
			INFLUENCER_SIZE[influencer.influencer_size] <
			INFLUENCER_SIZE[influencer_size]
		) {
			await influencer.updateOne(
				{ influencer_size: influencer_size },
				{ new: true }
			);
		}

		await influencer.save();

		// console.log(influencer);

		// lệnh update influencer size không save influencer mới nên phải tìm lại
		const new_influencer = await influencerModel.findOne({
			_id: ObjectID(influencer_id),
		});

		console.log(new_influencer);

		return { status: true, influencer: new_influencer };
	} catch (error) {
		console.error(error);
		return { status: false, message: error };
	}
};
