import influencerModel from '../models/influencers';
const ObjectID = require('mongodb').ObjectId;
import { INFLUENCER_SIZE } from '../constants';

export const updateInfluencer = async (
	influencer_id,
	social_name,
	profile_link,
	followers,
	influencer_size,
	categories,
	total_post,
	engagement_score,
	page_id
) => {
	try {
		console.log('updateInfluencer service');

		console.log(influencer_id);

		// --------------- Find Influencer ---------------
		// get influencer hasn't connected facebook yet
		const influencer = await influencerModel.findOne({
			_id: ObjectID(influencer_id),
			//'social_network.channel_name': { $ne: 'facebook' },
		});

		/*
 		if (!influencer) {
 			return {
 				influencer: null,
 				message: 'Influencer has connected facebook already',
 			};
 		} 
*/

		console.log(influencer);

		// --------------- Update social network ---------------
		const listSocial = influencer.social_network;

		const newListSocial = listSocial.map((social) => {
			return social.channel_name === 'facebook'
				? {
						social_name: social_name,
						profile_link: profile_link,
						followers: followers,
						total_post: total_post,
						engagement_score: engagement_score,
						channel_name: 'facebook',
						social_id: page_id,
						error_link: false,
						is_crawl: false,
				  }
				: social;
		});

		console.log({ newListSocial });

		await influencer.updateOne(
			{ social_network: newListSocial },
			{ new: true }
		);

		// if influencer hasn't connected facebook -> add a new one

		// --------------- Update influencer size ---------------
		if (
			INFLUENCER_SIZE[influencer.influencer_size] <
			INFLUENCER_SIZE[influencer_size]
		) {
			await influencer.updateOne(
				{ influencer_size: influencer_size },
				{ new: true }
			);
		}

		// --------------- Update categories ---------------
		console.log('category influencer');
		console.log({ categories });
		// console.log(influencer.user_detail.categories);
		var merge_categories = influencer.user_detail.categories.concat(categories);
		var unique_merge_categories = [...new Set(merge_categories)];
		// console.log(merge_categories);
		// console.log(unique_merge_categories);

		if (influencer.user_detail.categories !== unique_merge_categories) {
			await influencer.updateOne(
				{ 'user_detail.categories': unique_merge_categories },
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

		return { influencer: new_influencer };
	} catch (error) {
		console.error(error);
		return { influencer: null, message: error };
	}
};
