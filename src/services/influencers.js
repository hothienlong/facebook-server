import { INFLUENCER_SIZE } from '../constants';
import influencerModel from '../models/influencers';
const ObjectID = require('mongodb').ObjectId;

export const updateInfluencer = async (
	influencer_id,
	social_name,
	profile_link,
	followers,
	influencer_size,
	categories,
	total_post,
	engagement_score,
	sentiment_score,
	f_score,
	inf_score,
	page_id,
	access_token
) => {
	try {
		console.log('updateInfluencer service');

		console.log(influencer_id);

		// --------------- Find Influencer ---------------
		const influencer = await influencerModel.findOne({
			_id: ObjectID(influencer_id),
		});

		console.log(influencer);

		// Get influencer size
		const new_influencer_size = get_new_influencer_size(
			influencer.influencer_size,
			influencer_size
		);

		// Get categories
		const new_categories = get_new_categories(
			influencer.user_detail.categories,
			categories
		);

		const new_influencer = await influencerModel.findOneAndUpdate(
			{
				_id: ObjectID(influencer_id),
				'social_network.channel_name': 'facebook',
			},
			{
				$set: {
					'social_network.$.followers': followers,
					'social_network.$.social_name': social_name,
					'social_network.$.social_id': page_id,
					'social_network.$.profile_link': profile_link,
					'social_network.$.access_token': access_token,
					'social_network.$.total_post': total_post,
					'social_network.$.engagement_score': engagement_score,
					'social_network.$.sentiment_score': sentiment_score,
					'social_network.$.fScore': f_score,
					'social_network.$.error_link': false,
					'social_network.$.time_update': Date.now(),
					'social_network.$.is_crawl': false,
				},
				influencer_size: new_influencer_size,
				'user_detail.categories': new_categories,
				inf_score: inf_score,
			}
		);

		console.log(new_influencer);

		return { influencer: new_influencer };
	} catch (error) {
		console.error(error);
		return { influencer: null, message: error };
	}
};

// --------------- Update categories ---------------

const get_new_categories = function (categories_in_db, categories_update) {
	console.log('category influencer');
	console.log({ categories_update });
	// console.log(influencer.user_detail.categories);
	let merge_categories = categories_in_db.concat(categories_update);
	let unique_merge_categories = [...new Set(merge_categories)];
	// console.log(merge_categories);
	// console.log(unique_merge_categories);
	return unique_merge_categories;
};

// --------------- Update influencer size ---------------

const get_new_influencer_size = function (
	influencer_size_in_db,
	influencer_size_update
) {
	{
		if (
			INFLUENCER_SIZE[influencer_size_in_db] <
			INFLUENCER_SIZE[influencer_size_update]
		) {
			return influencer_size_update;
		} else {
			return influencer_size_in_db;
		}
	}
};
