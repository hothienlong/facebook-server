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
		const influencer = await influencerModel.findOneAndUpdate(
			{ _id: ObjectID(influencer_id) },
			{
				influencer_size: influencer_size,
			},
			{
				new: true,
			}
		);
		console.log(influencer);

		influencer.social_network.push({
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
