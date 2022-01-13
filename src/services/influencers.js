import influencerModel from '../models/influencers';
const ObjectID = require('mongodb').ObjectId;

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
		console.log(influencer);

		if (!influencer) {
			return {
				status: false,
				message: 'Influencer has connected facebook already',
			};
		}

		// if influencer hasn't connected facebook -> add a new one
		await influencer.updateOne({ influencer_size: influencer_size });

		await influencer.social_network.push({
			channel_name: 'facebook',
			social_name: social_name,
			profile_link: profile_link,
			followers: followers,
			engagement_score: engagement_score,
		});

		await influencer.save();

		console.log(influencer);

		return { status: true, influencer: influencer };
	} catch (error) {
		console.error(error);
		return { status: false, message: error };
	}
};
